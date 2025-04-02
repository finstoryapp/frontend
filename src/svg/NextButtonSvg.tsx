const NextButtonSvg: React.FC = () => {
  return (
    <svg
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform="rotate(180)" // Rotates the entire SVG
    >
      <path
        d="M8.75 1.5L1.25 9L8.75 16.5"
        stroke="#3E9FFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NextButtonSvg;
