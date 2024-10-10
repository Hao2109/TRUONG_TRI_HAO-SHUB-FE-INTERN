import { Card } from "antd";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden gap-16 px-16 py-8 bg-[#FEFEFF]">
      <Card
        style={{
          padding: 24,
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        }}
      >
        <button
          className="font-base text-[14px]"
          onClick={() => navigate("task-1")}
        >
          Task 1
        </button>
      </Card>

      <Card
        style={{
          padding: 24,
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        }}
      >
        <button
          className="font-base text-[14px]"
          onClick={() => navigate("task-2")}
        >
          Task 2
        </button>
      </Card>

      <Card
        style={{
          padding: 24,
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        }}
      >
        <button
          className="font-base text-[14px]"
          onClick={() => navigate("task-3")}
        >
          Task 3
        </button>
      </Card>
    </div>
  );
};

export default HomePage;
