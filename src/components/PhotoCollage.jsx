import React, { useState, useEffect, useRef } from "react";
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
  const constraintsRef = useRef(null);

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
    <div
      ref={constraintsRef}
      className="relative w-full h-full flex items-center justify-center pointer-events-auto overflow-visible"
    >
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

  // Your updated limits
  const limits = isMobile
    ? { x: 25, y: 50 } // Tight X, Loose Y for mobile
    : { x: 300, y: 250 }; // Moderate X, Tight Y for desktop

  // Restored original starting spread
  const spreadX = isMobile ? 75 : 150;
  const spreadY = isMobile ? 60 : 120;

  const [initialPos] = useState({
    rotate: Math.random() * 10 - 5,
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
        left: -limits.x,
        right: limits.x,
        top: -limits.y,
        bottom: limits.y,
      }}
      dragElastic={0.1}
      dragMomentum={false}
      whileTap={{ scale: 1.02, cursor: "grabbing" }}
      initial={{
        opacity: 0,
        scale: 0.8,
        rotate: initialPos.rotate,
        x: initialPos.x,
        y: initialPos.y,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: isActive ? initialPos.dragRotate : initialPos.rotate,
        transition: {
          rotate: { type: "spring", stiffness: 200, damping: 20 },
          opacity: { delay: index * 0.1 },
          scale: { delay: index * 0.1, type: "spring", stiffness: 100 },
        },
      }}
      style={{
        zIndex,
        position: "absolute",
        cursor: "grab",
        boxShadow: `0 10px 30px ${theme.text}25`,
        border: `3px solid ${theme.text}`,
        lineHeight: 0,
        width: isMobile ? "160px" : "320px",
        willChange: "transform",
        touchAction: "none",
      }}
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
