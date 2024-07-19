import { Carousel, IconButton } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useState } from "react";

export default function CarouselImgs({ imgs, base64, setIdx }) {
  CarouselImgs.propTypes = {
    imgs: PropTypes.array.isRequired,
    base64: PropTypes.bool.isRequired,
    setIdx: PropTypes.func.isRequired,
  };

  const [isZoom, setIsZoom] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const [index, setIndex] = useState(0);

  return (
    <div className="h-[300px] w-[80rem]">
      <Carousel
        className="rounded-xl"
        prevArrow={({ handlePrev }) => (
          <IconButton
            variant="text"
            color="white"
            size="lg"
            onClick={() => {
              handlePrev();
              if (index === 0) return;
              setIndex(index - 1);
              setIdx(index - 1);
            }}
            className="!absolute top-2/4 left-4 -translate-y-2/4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </IconButton>
        )}
        nextArrow={({ handleNext }) => (
          <IconButton
            variant="text"
            color="white"
            size="lg"
            onClick={() => {
              handleNext();
              if (index === imgs.length - 1) return;
              setIndex(index + 1);
              setIdx(index + 1);
            }}
            className="!absolute top-2/4 !right-4 -translate-y-2/4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </IconButton>
        )}
      >
        {imgs.map((img, index) => (
          <img
            key={index}
            className="h-full w-full object-cover cursor-pointer"
            alt={"img " + index}
            {...(!base64
              ? { src: img }
              : { src: "data:image/jpg;base64," + img })}
            onClick={() => {
              setImgIndex(index);
              setIsZoom(!isZoom);
            }}
          />
        ))}
      </Carousel>
      {isZoom && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center"
          onClick={() => setIsZoom(!isZoom)}
        >
          <div>
            <img
              className="h-[80%] w-[80%] "
              alt={"img " + imgIndex}
              {...(!base64
                ? { src: imgs[imgIndex] }
                : { src: "data:image/jpg;base64," + imgs[imgIndex] })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
