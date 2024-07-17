import { Carousel } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useState } from "react";

export default function CarouselImgs({ imgs, base64 }) {
  CarouselImgs.propTypes = {
    imgs: PropTypes.array.isRequired,
    base64: PropTypes.bool.isRequired,
  };

  const [isZoom, setIsZoom] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <div>
      <Carousel transition={{ duration: 0.25 }} className="rounded-xl">
        {imgs.map((img, index) => (
          <img
            key={index}
            className="h-[200px] w-full object-cover cursor-pointer"
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
          <img
            className="h-[80%] w-[80%] object-contain"
            alt={"img " + imgIndex}
            {...(!base64
              ? { src: imgs[imgIndex] }
              : { src: "data:image/jpg;base64," + imgs[imgIndex] })}
          />
        </div>
      )}
    </div>
  );
}
