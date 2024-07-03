import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
    const [files, setFiles] = useState([]);
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFilesChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select at least one image.');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`files`, file);
        });

        try {
            const response = await axios.post('http://localhost:8000/merge-images/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob' // This ensures we get the response as a Blob for image handling
            });

            const imageUrl = URL.createObjectURL(response.data);
            setResultImage(imageUrl);
        } catch (error) {
            console.error('Error uploading images:', error);
            setError('Failed to upload images. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="image-uploader">
            <h1>Upload Images to Merge</h1>
            <input type="file" multiple onChange={handleFilesChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload and Merge'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {resultImage && (
                <div>
                    <h2>Resulting Image:</h2>
                    <img src={resultImage} alt="Merged result" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
