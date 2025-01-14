import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, notification, message, Input, Progress } from "antd";
import { getUser, updateUser } from "../../services/apiHandle";

// const getBase64 = (img, callback) => {
//   const reader = new FileReader();
//   reader.addEventListener("load", () => callback(reader.result));
//   reader.readAsDataURL(img);
// };

// const beforeUpload = (file) => {
//   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
//   if (!isJpgOrPng) {
//     message.error("You can only upload JPG/PNG file!");
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error("Image must smaller than 2MB!");
//   }
//   return isJpgOrPng && isLt2M;
// };

const Account = () => {
  const [userData, setUserData] = useState([]);

  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // Trạng thái upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file); // File upload
    formData.append("upload_preset", "WMS_img_storage"); // Thay bằng upload preset của bạn
    formData.append("cloud_name", "dvntykgtk"); // Thay bằng cloud name của bạn

    try {
      setLoading(true);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dvntykgtk/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setImageUrl(data.secure_url); // Lưu URL ảnh sau khi upload
      setLoading(false);
      onSuccess(data); // Gọi callback khi upload thành công
      // message.success("Upload successful!");
    } catch (error) {
      message.error("Upload failed:", error);
      setLoading(false);
      onError(error); // Gọi callback khi upload thất bại
      message.error("Upload failed!");
    }
  };
  useEffect(() => {
    const updateUserWithAvatarLink = async () => {
      if (!imageUrl || imageUrl === userData.img_url) return;
      try {
        const newUser = { ...userData, img_url: imageUrl };
        const result = await updateUser(id, newUser);
        if (result.success === false) {
          notification.error({
            message: "Error when fetching",
            description: result.message,
            placement: "topRight",
            duration: 1.5,
          });
          return;
        }
        notification.success({
          message: "Upload Successfully !",
          placement: "topRight",
          duration: 1.5,
        });
      } catch (err) {
        notification.error({
          message: err.message,
          placement: "topRight",
          duration: 1.5,
        });
      }
    };

    if (!(imageUrl === userData.img_url)) {
      console.log(imageUrl === userData.img_url);
      updateUserWithAvatarLink();
    }
  }, [imageUrl, userData.img_url]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUser();
        if (result.success === false) {
          notification.error({
            message: "Error when fetching",
            description: result.message,
            placement: "topRight",
            duration: 1.5,
          });
          return;
        }
        const user = result.data.find((item) => item._id === id);
        setImageUrl(user.img_url);
        setUserData(user ? user : []); // Giả định user có `fields` là danh sách các field
      } catch (err) {
        notification.error({
          message: err.message,
          placement: "topRight",
          duration: 1.5,
        });
      }
    };

    fetchUser();
  }, [id]);

  const renderFields = () => {
    return Object.keys(userData)
      .filter((key) => key !== "password" && key !== "img_url")
      .map((key, index) => (
        <div key={index}>
          <label className="roboto-slab-base text-base">
            {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
          </label>
          <Input
            size="large"
            className="mt-2 roboto-slab-base"
            value={userData[key]}
            readOnly
          />
        </div>
      ));
  };

  return (
    <div className="flex w-full h-min-[500px] justify-between px-8">
      <div className="img_area w-1/4 flex justify-center">
        <Upload
          name="avatar"
          listType="picture-card"
          progress={{ strokeWidth: 2, showInfo: false }}
          className="avatar-uploader"
          showUploadList={false}
          customRequest={handleUpload} // Dùng custom request để upload
          beforeUpload={(file) => {
            const isJpgOrPng =
              file.type === "image/jpeg" || file.type === "image/png";
            if (!isJpgOrPng) {
              message.error("You can only upload JPG/PNG file!");
              return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
              message.error("Image must smaller than 2MB!");
              return false;
            }
            return isJpgOrPng && isLt2M;
          }}
        >
          {uploading ? (
            <div style={{ textAlign: "center" }}>
              <Progress
                type="circle"
                percent={uploadProgress}
                status="active"
              />
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </div>
      <div className="main w-3/4 grid grid-cols-2 gap-6">{renderFields()}</div>
    </div>
  );
};
export default Account;
