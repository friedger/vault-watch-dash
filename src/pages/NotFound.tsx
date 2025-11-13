import { Layout } from "@/components/Layout";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="mb-4 text-4xl font-bold">Information not Found (404)</h1>
        <p className="mb-4 text-xl text-gray-600">
          Ask your community
        </p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </Layout>
  );
};

export default NotFound;
