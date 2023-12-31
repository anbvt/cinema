"use client";
import { constants } from "@/common/constants";
import { checkError } from "@/common/validation/error";
import { CardDefault } from "@/components/Card";
import SelectOption from "@/components/Select";
import { homeAPI } from "@/util/API/Home";
import { movieAPI } from "@/util/API/Movie";
import { errorNotification } from "@/util/Notification";
import { Input, Pagination } from "antd";
import { SearchProps } from "antd/es/input";
import $ from "jquery";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import "./index.css";
import { BiSolidSearch } from "react-icons/bi";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";

const { Search } = Input;
type SelectedType = {
  movieType: movieType[];
  country: country[];
  branch: branch[];
};

const Home = () => {
  const { data: session } = useSession();
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<movie[]>();
  const [dataSelect, setSelect] = useState<SelectedType | undefined>();
  const [moviesNowShowing, setMoviesNowShowing] = useState<movie[]>();
  const [cookie, setCookie] = useCookies(["statusId"]);
  const { register, setValue, handleSubmit } = useForm<MovieFilter>();
  const handlePageChange = (page: any, pageSize: any) => {
    setCurrentPage(page);
  };
  const statusOfMovie = [
    {
      id: 0,
      name: "Phim sắp chiếu",
    },
    {
      id: 1,
      name: "Phim đang chiếu",
    },
  ];
  const next = () => {
    let list = $(".main");
    $("#slide").append(list[0]);
  };
  const prev = () => {
    let list = $(".main");
    $("#slide").prepend(list[list.length - 1]);
  };
  useEffect(() => {
    if (cookie.statusId == undefined) {
      handleCookie("1");
    } else {
      const init = async () => {
        const movie = await movieAPI.findByStatus(
          cookie.statusId,
          itemsPerPage,
          currentPage
        );
        setData(movie);
        const mv = await movieAPI.findByStatus("1", "", "");
        setMoviesNowShowing(mv);
        const selected = await homeAPI.findAll();
        setSelect(selected);
        register("status", { value: cookie.statusId });
      };
      init();
    }
  }, [cookie.statusId, currentPage]);
  const handleCookie = (value: string, event?: any) => {
    if (event != undefined) event.preventDefault();
    setCookie("statusId", value);
    setValue("status", value);
    setCurrentPage(1);
  };
  const onSearch: SearchProps["onSearch"] = async (value) => {
    try {
      const resultSearch = await homeAPI.searchMovie({
        branch: "",
        country: 0,
        movieType: "",
        status: cookie.statusId,
        name: value,
      });
      setData(resultSearch);
    } catch (e: any) {
      errorNotification(
        checkError(e.response.data.message, e.response.data.param) || ""
      );
    }
  };
  const onSubmit: SubmitHandler<MovieFilter> = async (data) => {
    try {
      const resultSearch = await homeAPI.searchMovie({
        branch: data.branch,
        country: data.country,
        movieType: data.movieType,
        status: data.status,
        name: "",
      });
      setData(resultSearch);
    } catch (e: any) {
      errorNotification(
        checkError(e.response.data.message, e.response.data.param) || ""
      );
    }
  };
  return (
    <>
      {data === undefined && !session !== undefined ? (
        <Loading data={data} />
      ) : (
        <div>
          {moviesNowShowing?.length != 0 && (
            <>
              <div className="lll hidden lg:block">
                <div id="slide">
                  {moviesNowShowing?.map((m, i) => {
                    return (
                      <div
                        key={m.id}
                        className="main"
                        style={{
                          backgroundImage: `url(${constants.URL_IMAGES}${m.poster})`,
                        }}
                      >
                        <div className="content rounded-md">
                          <div className="font-bold text-lg mx-4 ">
                            {m.name}
                          </div>
                          <div className="mb-4 m-4 text-white">
                            {m.describe}
                          </div>
                          <Link
                            key={`now_${m.id}`}
                            className={`font-bold hover:text-red-900 m-4`}
                            id={`nowShowing_${i}`}
                            href={{
                              pathname: `/movie-details`,
                              query: { id: m.id },
                            }}
                          >
                            Xem thêm
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="buttons">
                  <button onClick={() => next()}>
                    <FaAngleLeft size={40} />
                  </button>
                  <button onClick={() => prev()}>
                    <FaAngleRight size={40} />
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="search justify-evenly md:flex my-4 mb-6 p-3 ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="md:flex items-center"
            >
              <div className="mr-0 sm:mr-8">
                <label htmlFor="" className="opacity-50 font-bold">
                  Quốc Gia
                </label>
                <hr className="opacity-50" />
                <SelectOption
                  className="w-auto max-sm:w-full text-white bg-inherit border-3 rounded my-3 p-2 h-10 ring-1 ring-red-500/50"
                  register={register("country")}
                  defaultValue={0}
                  id="country"
                  name="Quốc gia"
                  options={dataSelect?.country.map((value) => ({
                    value: value.id,
                    label: value.name,
                    className: "bg-gray-800 text-white ",
                  }))}
                />
              </div>
              <div className="mr-0 sm:mr-8">
                <label htmlFor="" className="opacity-50 font-bold">
                  Thể Loại
                </label>
                <hr className="opacity-50" />
                <SelectOption
                  className="w-auto max-sm:w-full text-white bg-inherit border-3 rounded my-3 p-2 h-10 ring-1 ring-red-500/50"
                  register={register("movieType")}
                  defaultValue={""}
                  id="movieType"
                  name="Thể loại"
                  options={dataSelect?.movieType.map((value) => ({
                    value: value.id,
                    label: value.name,
                    className: "bg-gray-800 text-white hover:bg-red-600",
                  }))}
                />
              </div>
              <div className="mr-0 sm:mr-8">
                <label htmlFor="" className="opacity-50 font-bold">
                  Chi Nhánh
                </label>
                <hr className="opacity-50" />
                <SelectOption
                  className="w-auto max-sm:w-full text-white bg-inherit border-3 rounded my-3 p-2 h-10 ring-1 ring-red-500/50"
                  register={register("branch")}
                  defaultValue={""}
                  id="branch"
                  name="Chi nhánh"
                  options={dataSelect?.branch.map((value) => ({
                    value: value.id,
                    label: value.name,
                    className: "bg-gray-800 text-white hover:bg-red-600",
                  }))}
                />
              </div>
              <div className="mt-6 block w-full lg:inline">
                <button
                  type="submit"
                  className="w-full text-white border-3 rounded p-2 lg:px-6 hover:bg-red-600 ring-1 ring-red-500/50"
                >
                  <BiSolidSearch className="hidden md:inline" />
                  <label className="inline lg:hidden ">Tìm kiếm</label>
                </button>
              </div>
            </form>
            <div className="lg:mr-8">
              <label htmlFor="" className="opacity-50 font-bold">
                Tìm Kiếm
              </label>
              <hr className="opacity-50 mb-3" />
              <Search
                enterButton
                allowClear={true}
                onSearch={onSearch}
                bordered={false}
                size="large"
                style={{ backgroundColor: "inherit" }}
                className="w-auto max-sm:w-full my-auto ring-1 ring-red-500/50 rounded"
              />
            </div>
          </div>
          <div className="group">
            <div className="overlap-group">
              <div className="div type">
                <div className="flex flex-row justify-center text-center">
                  {statusOfMovie.map((status, i) => {
                    return (
                      <div key={"status_" + i} className="p-4 mt-3">
                        <button
                          className={`lg:text-3xl text-lg font-bold ${
                            status.id == cookie.statusId
                              ? "text-red-900"
                              : "text-white"
                          }`}
                          id={`type_${i}`}
                          onClick={(event) => {
                            handleCookie(status.id + "", event);
                          }}
                        >
                          {status.name}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-3 mx-auto flex flex-row max-sm:justify-center justify-start flex-wrap w-4/5 "
            id="movie"
          >
            {data?.map((movie: movie, index) => {
              return (
                <Link
                  key={"mv" + movie.id}
                  className="lg:basis-1/4"
                  id={`${index}`}
                  href={{
                    pathname: `/movie-details`,
                    query: { id: movie.id },
                  }}
                >
                  <CardDefault
                    id={`card_${movie.id}`}
                    key={movie.id}
                    className=""
                    data={movie}
                  />
                </Link>
              );
            })}
          </div>

          {moviesNowShowing && moviesNowShowing.length > 12 && (
            <Pagination
              className="text-center pt-2"
              responsive
              current={currentPage}
              pageSize={itemsPerPage}
              total={moviesNowShowing?.length}
              onChange={handlePageChange}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Home;
