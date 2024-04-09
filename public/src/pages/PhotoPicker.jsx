import React, { useState } from "react";

const PhotoPicker = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    console.log(file);
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Choose Your Photo</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {selectedFile && (
        <div style={{ width: "50%", margin: "auto" }}>
          <h3>Selected Photo:</h3>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Selected Photo"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default PhotoPicker;
