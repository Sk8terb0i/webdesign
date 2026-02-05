import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Import images
import noe1 from "../assets/images/noe_1.jpg";
import noe2 from "../assets/images/noe_2.jpg";
import noe3 from "../assets/images/noe_3.jpg";
import noe4 from "../assets/images/noe_4.jpg";
import noe5 from "../assets/images/noe_5.jpg";

const imageAssets = [noe1, noe2, noe3, noe4, noe5];

const PhotoCollage = ({ theme }) => {
  const [orderedImages, setOrderedImages] = useState([]);
  const [topZ, setTopZ] = useState(imageAssets.length);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      const shuffled = [...imageAssets].sort(() => Math.random() - 0.5);
      const selection = mobile ? shuffled.slice(0, 3) : shuffled;

      setOrderedImages(
        selection.map((src, index) => ({
          src,
          id: `img-${index}`,
          z: index,
        })),
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePointerDown = (id) => {
    setTopZ((prev) => prev + 1);
    setOrderedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, z: topZ + 1 } : img)),
    );
  };

  return (
    /* Removed overflow-hidden so images aren't cut off when dragged/tilted */
    <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
      {orderedImages.map((img, index) => (
        <PhotoItem
          key={img.id}
          src={img.src}
          index={index}
          zIndex={img.z}
          onPointerDown={() => handlePointerDown(img.id)}
          theme={theme}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

const PhotoItem = ({ src, index, zIndex, onPointerDown, theme, isMobile }) => {
  const [isActive, setIsActive] = useState(false);

  const spreadX = isMobile ? 75 : 150;
  const spreadY = isMobile ? 60 : 120;

  const dragLimitX = isMobile ? 20 : 350;
  const dragLimitY = isMobile ? 30 : 300;

  const [initial] = useState({
    rotate: Math.random() * 6 - 3,
    x: Math.random() * (spreadX * 2) - spreadX,
    y: Math.random() * (spreadY * 2) - spreadY,
    dragRotate: Math.random() * 14 - 7,
  });

  return (
    <motion.div
      onPointerDown={() => {
        onPointerDown();
        setIsActive(true);
      }}
      onPointerUp={() => setIsActive(false)}
      onPointerCancel={() => setIsActive(false)}
      drag
      dragConstraints={{
        left: -dragLimitX,
        right: dragLimitX,
        top: -dragLimitY,
        bottom: dragLimitY,
      }}
      dragElastic={isMobile ? 0.4 : 0.1}
      whileTap={{ scale: 1.01, cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 0.9, rotate: 0, x: 0, y: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: isActive ? initial.dragRotate : initial.rotate,
        x: initial.x,
        y: initial.y,
        transition: {
          rotate: { type: "spring", stiffness: 200, damping: 15 },
          default: {
            delay: index * 0.08,
            type: "spring",
            stiffness: 70,
            damping: 20,
          },
        },
      }}
      style={{
        zIndex,
        position: "absolute",
        cursor: "grab",
        boxShadow: `0 4px 15px ${theme.text}15`,
        border: `2px solid ${theme.text}`,
        lineHeight: 0,
      }}
      className="w-40 md:w-80 transition-shadow duration-300"
    >
      <img
        src={src}
        alt="noe"
        className="w-full h-auto pointer-events-none select-none"
      />
    </motion.div>
  );
};

export default PhotoCollage;
