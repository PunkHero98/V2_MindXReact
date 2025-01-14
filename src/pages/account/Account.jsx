import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Upload, notification, message,Progress , Typography , Modal} from "antd";
import { getUser, updateUser } from "../../services/apiHandle";
import { login } from "../../features/auth/Login";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { Avatar } from "antd";
const {Paragraph} = Typography;
const Account = () => {
  const [userData, setUserData] = useState([]);

  const { id } = useParams();
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false); 
  const [openModal , setOpenModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100); 
            onProgress({ percent });
            setUploadProgress({ percent })
          }
        }
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
        const newUser = { ...userData, img_url: imageUrl };
        const result = await updateUser(id, newUser);
        if (result.success === false) {
          notification.error({
            message: "Error when fetching",
            description: result.message,
            placement: "topRight",
            duration: 1.5,
          });
          dispatch(login({...userData , img_url:imageUrl}));
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
        setUserData(user ? user : []);
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
          <label className="merriweather text-base">
            {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
          </label>
          {/* <Input
            size="large"
            className="mt-2 roboto-slab-base"
            value={userData[key]}
            readOnly
          /> */}
          <Paragraph copyable className=" mt-2 roboto-slab-base" >{userData[key]}</Paragraph>
        </div>
      ));
  };
  const handleOpenModal = () =>{
      setOpenModal(true);
  }
  return (
    <>
      <div className="flex w-full h-min-[500px] justify-between px-8">
        <div className="img_area w-1/4 flex flex-col items-center justify-between py-8">
          
          <div className="w-44 h-44 mb-4 border border-gray-300 rounded-lg flex justify-center items-center bg-gray-100">
            <Avatar
              onClick={handleOpenModal}
              src={imageUrl}
              className="w-[90%] h-[90%] object-cover rounded-lg cursor-pointer"
            />
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
                "image/heic"
              ];
              const allowedExtensions = ["jpeg", "jpg", "png", "webp", "heic"]; // Các phần mở rộng cho phép
            
              const fileExtension = file.name.split('.').pop().toLowerCase(); // Lấy phần mở rộng file
              const isAllowedType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
            
              if (!isAllowedType) {
                message.error("You can only upload JPG, PNG, HEIC, or WEBP files!");
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
              className={`${uploading ? '' : 'opacity-0' } px-10`}
              type="line"
              percent={uploadProgress.percent} 
              status="active"
              strokeColor="#1677ff" 
              style={{ width: '100%' }}
              showInfo={true}
            />
            <div className="w-[90%] h-[48%]  rounded-md outline outline-[#1677ff] flex flex-col gap-2">
              <div className="w-full h-10 bg-[#1677ff] flex justify-center items-center">
              <label className="pacifico text-white text-xl">History Avatar</label>
              </div >
                <div className="px-2 pb-2 grid grid-flow-row grid-cols-4 gap-4 overflow-y-auto">
                  <img src={imageUrl} alt="" className="w-25 "/>
                </div>
            </div>
        </div>
    
        {/* Khu vực chính */}
        <div className="main w-3/4 grid grid-cols-1 grid-rows-2 gap-6">
          <div className="flex flex-col outline outline-blue-400 rounded-md">
            <div className="w-full h-10 bg-[#1677ff] flex justify-center items-center">
              <label className="pacifico text-white text-xl">Details</label>
            </div >
            <div className="grid grid-cols-2 gap-6 px-4 py-4">
            {renderFields()}
            </div>
          </div>
          <div className="outline outline-blue-400 p-8 rounded-md mb-8"></div>
        </div>
      </div>
      <Modal
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
        >
        <div className="mt-8">
          <img src={imageUrl}/>
        </div>
      </Modal>
    </>
  );
  
};
export default Account;
