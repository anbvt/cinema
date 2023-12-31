"use client"
import {constants} from "@/common/constants";
import {CardDiscount} from "@/components/CardDiscount";
import Template from "@/components/Comment/template";
import WeekDate from "@/components/Date";
import {movieDetailPageAPI} from '@/util/API/MovieDetailPage';
import type {TabsProps} from 'antd';
import {Rate, Tabs} from "antd";
import Image from 'next/image';
import Link from "next/link";
import {useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import '../../globals.css';

const MovieDetails = () => {
    const [movieDetailPage, setMovieDetailPage] = useState<movieDetailPage>();
    const searchParams = useSearchParams();
    const movieId = searchParams.get("id");

    const responsive = {
        desktop: {
            breakpoint: {max: 3000, min: 1024},
            items: 5,
        },
        tablet: {
            breakpoint: {max: 1024, min: 464},
            items: 2,
        },
        mobile: {
            breakpoint: {max: 464, min: 0},
            items: 1,
        },
    };
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'NỘI DUNG PHIM',
            children: <p className="text-justify pt-5 text-sx text-white">
                {movieDetailPage?.movieDetail.describe}
            </p>
        },
        {
            key: '2',
            label: 'TRAILER',
            children: <div className="flex justify-center">
                <iframe className="max-sm:w-full w-[680px] h-[450px]" src={`${movieDetailPage?.movieDetail.trailer}`}
                        title="Trailer movie"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen></iframe>
            </div>
        }
    ];
    useEffect(() => {
        const init = async () => {
            if (movieId != null) {
                const result = await movieDetailPageAPI.findMovieDetailPage(movieId);
                setMovieDetailPage(result);
            }
        };
        init();
    }, [movieId])

    return (
        <>
            <div className="w-full">
                <div className="px-10">
                    <div className="text-white p-4">
                        <h4>Trang chủ &gt; Đặt vé &gt; {movieDetailPage?.movieDetail.name}</h4>
                    </div>
                    <div className="text-white p-4">
                        <div className="grid grid-cols-12 gap-2">
                            <div className="lg:col-span-10 md:col-span-8 sm:col-span-12 col-span-12">
                                <div className="grid grid-cols-12 gap-6">
                                    {movieDetailPage &&
                                        <Image src={`${constants.URL_IMAGES}${movieDetailPage?.movieDetail.poster}`}
                                               className="lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12 w-full h-92 bg-white"
                                               width={2560} height={1440} alt="Movie Poster"/>}
                                    <div
                                        className="lg:col-span-9 md:col-span-6 sm:col-span-6 col-span-12 w-fit h-full text-lg">
                                        <p className="mb-3 text-4xl text-red-600 font-semibold">{movieDetailPage?.movieDetail.name}</p>
                                        <p><strong>Thể loại:</strong> {movieDetailPage?.movieDetail.movieTypeName}</p>
                                        <p><strong>Đạo diễn:</strong> {movieDetailPage?.movieDetail.directorsName}</p>
                                        <p><strong>Diễn viên:</strong> {movieDetailPage?.movieDetail.actorsName}</p>
                                        <p><strong>Ngôn ngữ:</strong> {movieDetailPage?.movieDetail.languagesName}</p>
                                        <p><strong>Thời gian chiếu:</strong> {movieDetailPage?.movieDetail.time} phút
                                        </p>
                                        <p><strong>Quốc gia:</strong> {movieDetailPage?.movieDetail.countryName}</p>
                                        <p><strong>Năm phát
                                            hành:</strong> {movieDetailPage?.movieDetail.yearofmanufacture}</p>
                                        <Rate value={movieDetailPage?.movieDetail.rate} disabled/>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2 md:col-span-4 sm:col-span-12 col-span-12 h-fit">
                                <CardDiscount to="register" valueQR="KHUYENMAI5%" discount="5"/>
                            </div>
                        </div>
                        <div className="col-span-12 mb-4">
                            <Tabs
                                size={"large"}
                                defaultActiveKey="1" items={items}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-10 px-3 mb-5">
                <div className="text-white">
                    <h3 className="text-center border-b-2 border-red-900 py-2 text-lg font-semibold">VUI LÒNG CHỌN THÔNG
                        TIN VÉ</h3>
                    <WeekDate movieId={movieId}/>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12">
                    <div className="h-fit mx-auto text-white">
                        <h4 className="text-center py-2 text-lg font-semibold">NHỮNG PHIM CÙNG THỂ LOẠI</h4>

                        <Carousel
                            responsive={responsive}
                            ssr
                            slidesToSlide={1}
                            infinite
                            className="mx-12 col-span-full"
                            itemClass="image-item"
                            deviceType={''}
                            autoPlay={true}
                            autoPlaySpeed={3000}
                        >
                            {movieDetailPage?.listTypeOfMovies ? (
                                movieDetailPage.listTypeOfMovies.map((mv, index) => (
                                    <div key={index} className="h-full">
                                        <Link
                                            key={mv.id}
                                            id={`nowShowing_${index}`}
                                            href={{
                                                pathname: ``,
                                                query: {id: mv.id}
                                            }}
                                        >
                                            <Image
                                                src={`${constants.URL_IMAGES}${mv.poster}`}
                                                alt={`aga`}
                                                width='2560' height='1440'
                                                className="h-full w-full"
                                            />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p>No movies currently showing.</p>
                            )}
                        </Carousel>
                    </div>
                </div>
            </div>
            <div className="md:mx-10 md:px-3 md:mb-5 grid grid-cols-12 gap-2">
                <div className="col-span-12">
                    <h3 className="text-center border-b-2 border-white py-2 text-lg font-semibold uppercase">Đánh
                        giá</h3>
                    <Template/>
                </div>
            </div>
        </>
    )
}

export default MovieDetails