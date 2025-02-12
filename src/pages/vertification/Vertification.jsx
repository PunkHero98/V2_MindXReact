import { useState } from "react";
import { Input, Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";
const Vertification = () => {
  return (
    <>
      <div className="flex justify-center items-center h-screen bg-sky-100">
        <div className="py-6 bg-white h-2/5 w-1/3 rounded-xl shadow-xl shadow-slate-400 flex flex-col justify-between items-center">
          <div>
            <h1>Please check your email and enter the OTP code:</h1>
          </div>
          <div className="flex flex-col items-center">
            <div>
              <Input.OTP size="large" className="text-3xl" />
              <div>
                <span>---</span>
              </div>
            </div>
            <Button>
              <RedoOutlined /> Resend
            </Button>
          </div>
          <div>
            <Button>Check</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vertification;
