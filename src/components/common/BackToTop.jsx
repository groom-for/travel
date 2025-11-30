import { useEffect, useState } from "react";
import "../../styles/backToTop.css";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button type="button" className="back-to-top" onClick={handleClick} aria-label="맨 위로 이동">
      ↑
    </button>
  );
};

export default BackToTop;
