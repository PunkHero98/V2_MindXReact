import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Upload,
  notification,
  message,
  Progress,
  Typography,
  Modal,
  Empty,
  Button,
  Skeleton,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getUser, updateUser } from "../../services/apiHandle";
import ChangePassWord from "../../components/changePassWord/ChangePassWord";
import { login } from "../../features/auth/Login";
import { useDispatch } from "react-redux";
import axios from "axios";

const { Paragraph } = Typography;
const Account = () => {
  const [userData, setUserData] = useState([]);

  const { id } = useParams();
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);
  const [previousImgUrl, setPreviousImgUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [openModalForPrevImgs, setOpenModalForPrevImgs] = useState(false);
  const [prevImgUrl, setPrevImgUrl] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1); // Mức zoom ban đầu
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Vị trí hình ảnh
  const [isDragging, setIsDragging] = useState(false); // Trạng thái kéo
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  const [loadingForUpdatePic, setLoadingForUpdatePic] = useState(false);
  const [loadingForDeletePic, setLoadingForDeletePic] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);

  const handleUpload = async ({ file, onSuccess, onError, onProgress }) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "WMS_img_storage");
    formData.append("cloud_name", "dvntykgtk");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dvntykgtk/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              const percent = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              onProgress({ percent });
              setUploadProgress({ percent });
            }
          },
        }
      );
      setImageUrl(response.data.secure_url);
      onSuccess(response.data);
      setUploading(false);
    } catch (error) {
      onError(error);
      message.error("Upload failed!");
      setUploading(false);
    }
  };

  useEffect(() => {
    const updateUserWithAvatarLink = async () => {
      if (!imageUrl || imageUrl === userData.img_url) return;
      try {
        const updatedHistoryImgs = userData.history_imgs.includes(
          previousImgUrl
        )
          ? [...userData.history_imgs]
          : [...userData.history_imgs, previousImgUrl];
        const newUser = {
          ...userData,
          img_url: imageUrl,
          history_imgs: updatedHistoryImgs,
        };
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
        setUserData({ ...result.data });
        const userss = {
          user_id: userData["_id"],
          username: userData.username,
          department: userData.department,
          img_url: imageUrl,
        };
        dispatch(login({ ...userss }));
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
      updateUserWithAvatarLink();
    }
  }, [imageUrl, userData.img_url]);

  useEffect(() => {
    setLoadingSkeleton(true);
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
        setPreviousImgUrl(user.img_url);
        setUserData(user ? user : []);
        setLoadingSkeleton(false);
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
    const allowedKeys = ["username", "role", "_id", "email", "department"]; // Chỉ hiển thị các key này
  
    return allowedKeys
      .filter((key) => key in userData) // Kiểm tra xem key có tồn tại trong userData không
      .map((key, index) => (
        <div key={index}>
          <label className="merriweather text-base">
            {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
          </label>
          <Paragraph copyable className="mt-2 roboto-slab-base">
            {userData[key]}
          </Paragraph>
        </div>
      ));
  };
  
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleImgs = (e) => {
    const src = e.target.src;
    setPrevImgUrl(src);
    setOpenModalForPrevImgs(true);
  };

  const handleSetAvatar = async () => {
    setLoadingForUpdatePic(true);
    if (prevImgUrl === imageUrl) {
      notification.warning({
        message: "This image is currently your avatar !",
        placement: "topRight",
        duration: 3,
      });
      setLoadingForUpdatePic(false);
      return;
    }
    setLoadingForUpdatePic(false);
    setOpenModalForPrevImgs(false);
    setPrevImgUrl(imageUrl);
    setImageUrl(prevImgUrl);
  };

  const handleDeleteImg = async () => {
    setLoadingForDeletePic(true);
    if (prevImgUrl === imageUrl) {
      notification.warning({
        message: "You can not delete your current avatar!",
        description: "replace it with a new one before repeat this action.",
        placement: "topRight",
        duration: 3,
      });
      setLoadingForDeletePic(false);
      return;
    }
    try {
      const newHistoryImgs = userData.history_imgs.filter(
        (item) => item !== prevImgUrl
      );
      const newUser = { ...userData, history_imgs: newHistoryImgs };
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
      setLoadingForDeletePic(true);
      setConfirmDelete(false);
      setUserData({ ...result.data });
      setOpenModalForPrevImgs(false);
      notification.success({
        message: "Delete successfully !",
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

  const handleWheel = (event) => {
    event.preventDefault();
    const zoomSpeed = 0.1; // Tốc độ zoom
    const newScale =
      event.deltaY < 0 ? scale + zoomSpeed : Math.max(0.5, scale - zoomSpeed); // Giới hạn zoom nhỏ nhất là 0.5
    setScale(newScale);
  };

  // Bắt đầu kéo
  const handleMouseDown = (event) => {
    setIsDragging(true);
    setLastMousePosition({ x: event.clientX, y: event.clientY });
  };

  // Kéo hình ảnh
  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const deltaX = (event.clientX - lastMousePosition.x) / scale; // Điều chỉnh theo tỷ lệ zoom
    const deltaY = (event.clientY - lastMousePosition.y) / scale;

    setPosition((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));

    setLastMousePosition({ x: event.clientX, y: event.clientY });
  };

  // Kết thúc kéo
  const handleMouseUp = () => setIsDragging(false);

  return (
    <>
      <div className="flex w-full h-min-[500px] justify-between px-8">
        <div className="img_area w-1/4 flex flex-col items-center justify-between py-8">
          <div className="w-44 h-44 mb-4 border border-gray-300 rounded-lg flex justify-center items-center bg-gray-100">
            {!loadingSkeleton ? (
              imageUrl ? (
                <Avatar
                  onClick={handleOpenModal}
                  src={imageUrl}
                  className="w-[90%] h-[90%] object-cover rounded-lg cursor-pointer"
                />
              ) : (
                <UserOutlined className="text-7xl" />
              )
            ) : (
              <Skeleton.Image active />
            )}
          </div>
          <Upload
            className="outline outline-blue-400 rounded-lg pacifico text-lg text-blue-600 mt-[-0.5rem] cursor-pointer"
            showUploadList={false}
            customRequest={handleUpload}
            beforeUpload={(file) => {
              const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/webp",
                "image/heic",
              ];
              const allowedExtensions = ["jpeg", "jpg", "png", "webp", "heic"]; // Các phần mở rộng cho phép

              const fileExtension = file.name.split(".").pop().toLowerCase(); // Lấy phần mở rộng file
              const isAllowedType =
                allowedTypes.includes(file.type) ||
                allowedExtensions.includes(fileExtension);

              if (!isAllowedType) {
                message.error(
                  "You can only upload JPG, PNG, HEIC, or WEBP files!"
                );
                return false;
              }

              const isLt2M = file.size / 1024 / 1024 < 5;
              if (!isLt2M) {
                message.error("Image must be smaller than 5MB!");
                return false;
              }

              return isAllowedType && isLt2M;
            }}
          >
            <div className="px-8 py-2 hover:bg-blue-600 hover:text-white">
              Upload
            </div>
          </Upload>
          <Progress
            className={`${uploading ? "" : "opacity-0"} px-10`}
            type="line"
            percent={uploadProgress.percent}
            status="active"
            strokeColor="#1677ff"
            style={{ width: "100%" }}
            showInfo={true}
          />
          <div className="w-[90%] h-[48%]  rounded-md outline outline-[#1677ff] flex flex-col gap-2">
            <div className="w-full h-10 bg-[#1677ff] flex justify-center items-center">
              <label className="pacifico text-white text-xl">
                History Avatar
              </label>
            </div>
            {userData.history_imgs ? (
              <div className="px-2 pb-2 grid grid-flow-row grid-cols-4 gap-4 overflow-y-auto">
                {!loadingSkeleton ? (
                  userData.history_imgs.map((item, index) => (
                    <img
                      key={Date.now() + index}
                      src={item}
                      alt=""
                      className="w-25 hover:opacity-50 cursor-pointer"
                      onClick={(e) => handleImgs(e)}
                    />
                  ))
                ) : (
                  <Skeleton active />
                )}
              </div>
            ) : (
              <Empty className="mt-10" />
            )}
          </div>
        </div>

        {/* Khu vực chính */}
        <div className="main w-3/4 grid grid-cols-1 grid-rows-2 gap-6">
          <div className="flex flex-col outline outline-blue-400 rounded-md">
            <div className="w-full h-10 bg-[#1677ff] flex justify-center items-center">
              <label className="pacifico text-white text-xl">Details</label>
            </div>
            {!loadingSkeleton ? (
              <div className="grid grid-cols-2 gap-6 px-4 py-4">
                <div className=" grid grid-cols-2 gap-6">{renderFields()}</div>
                <ChangePassWord userData={userData} />
              </div>
            ) : (
              <Skeleton active className="mt-10 px-4" />
            )}
          </div>
          <div className="outline outline-blue-400 p-8 rounded-md mb-8"></div>
        </div>
      </div>
      <Modal
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
      >
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDragging(false)}
          className="mt-8 relative overflow-hidden w-full h-[400px] cursor-grab active:cursor-grabbing "
        >
          <img
            src={imageUrl}
            draggable="false"
            alt=""
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: "center",
            }}
            className="absolute top-0 left-0 transition-transform duration-50 ease-out"
          />
        </div>
      </Modal>

      <Modal
        open={openModalForPrevImgs}
        onCancel={() => setOpenModalForPrevImgs(false)}
        footer={
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="w-4/5 flex justify-between mt-2">
              <Button
                onClick={() => setConfirmDelete(true)}
                size="large"
                variant="solid"
                color="danger"
                className="pacifico text-xl"
              >
                Delete
              </Button>
              <Button
                onClick={() => setOpenModalForPrevImgs(false)}
                size="large"
                variant="outlined"
                color="danger"
                className="pacifico text-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSetAvatar}
                loading={loadingForUpdatePic ? true : false}
                size="large"
                variant="solid"
                color="primary"
                className="pacifico text-xl"
              >
                Set as Avatar
              </Button>
            </div>
          </div>
        }
      >
        <div className="mt-8 ">
          <img src={prevImgUrl} />
        </div>
      </Modal>
      <Modal
        open={confirmDelete}
        title="Deleting this will permanently remove it. Proceed?"
        className="merriweather"
        okText="Proceed"
        footer={
          <div style={{ display: "flex", justifyContent: "end", gap: 20 }}>
            <Button
              onClick={() => setConfirmDelete(false)}
              variant="outlined"
              color="primary"
              className="pacifico text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteImg}
              loading={loadingForDeletePic ? true : false}
              variant="solid"
              color="danger"
              className="pacifico text-base"
            >
              Proceed
            </Button>
          </div>
        }
      ></Modal>
    </>
  );
};
export default Account;
