import React, { useState } from 'react'

const WriteStory = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    url: '',
    postTitle: '',
    postTags: '',
    antispam: '',
    postContent: '',
    image: null
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Post submitted successfully!')
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>

      {/* Advertise banner */}
      <div style={{
        backgroundColor: '#222',
        color: '#ccc',
        textAlign: 'center',
        fontSize: '12px',
        padding: '6px',
        letterSpacing: '0.5px'
      }}>
        <em>advertise with us</em> &nbsp;&nbsp; 08141945087, 07038276054 &nbsp;&nbsp; amebonaija@gmail.com
      </div>

      <div className="container py-5" style={{ maxWidth: '860px' }}>

        {/* Page Title */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '300',
          marginBottom: '24px',
          color: '#222'
        }}>
          Write Your Story
        </h1>

        {/* Guidelines */}
        <ul style={{
          fontSize: '14px',
          color: '#333',
          lineHeight: '2',
          paddingLeft: '20px',
          marginBottom: '40px'
        }}>
          <li>Warning, do not spam by posting a repetitive story or spamlinks.</li>
          <li>You must NOT post job enquiries or sales or promotional offers via this page.</li>
          <li>Other readers have the ability to report non-genuine story, which can result in you being banned from the site.</li>
          <li>Your images must not exceed 2500 pixels both in height and width.</li>
          <li>Contact us for placing: adverts, press releases and sponsored contents on AMEBONAIJA website.</li>
          <li>For eye-witness stories, please support with pictures or screenshots and or videos or link to the video.</li>
          <li>Please be calm when writing to pass the message in your story to other readers clearly.</li>
        </ul>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Your Name */}
          <div className="mb-4">
            <label style={labelStyle}>Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              style={inputStyle}
            />
          </div>

          {/* Your Email */}
          <div className="mb-4">
            <label style={labelStyle}>Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              style={inputStyle}
            />
          </div>

          {/* Your URL */}
          <div className="mb-4">
            <label style={labelStyle}>Your URL</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="Your URL"
              style={inputStyle}
            />
          </div>

          {/* Post Title */}
          <div className="mb-4">
            <label style={labelStyle}>Post Title</label>
            <input
              type="text"
              name="postTitle"
              value={formData.postTitle}
              onChange={handleChange}
              placeholder="Post Title"
              style={inputStyle}
            />
          </div>

          {/* Post Tags */}
          <div className="mb-4">
            <label style={labelStyle}>Post Tags</label>
            <input
              type="text"
              name="postTags"
              value={formData.postTags}
              onChange={handleChange}
              placeholder="Post Tags"
              style={inputStyle}
            />
          </div>

          {/* Antispam */}
          <div className="mb-4">
            <label style={labelStyle}>5 + 1 =</label>
            <input
              type="text"
              name="antispam"
              value={formData.antispam}
              onChange={handleChange}
              placeholder="Antispam Question"
              style={{ ...inputStyle, maxWidth: '300px' }}
            />
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <label style={labelStyle}>Post Content</label>
            <textarea
              name="postContent"
              value={formData.postContent}
              onChange={handleChange}
              placeholder="Post Content"
              rows={10}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '200px'
              }}
            />
          </div>

          {/* Upload Image */}
          <div className="mb-4">
            <label style={labelStyle}>Upload an Image</label>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
              Please select your image(s) to upload.
            </p>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={{
                fontSize: '14px',
                color: '#333',
                padding: '4px 0'
              }}
            />
          </div>

          {/* Submit */}
          <div className="mt-4">
            <button
              type="submit"
              style={{
                padding: '10px 28px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#fff',
                background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                letterSpacing: '0.5px'
              }}
            >
              Submit Post
            </button>
          </div>

        </form>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light py-5 mt-4">
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <h5 className="fw-bold mb-3">AMEBONAIJA</h5>
              <p className="small">Nigeria's leading source for breaking news, entertainment, and sports updates.</p>
            </div>
            <div className="col-md-3">
              <h6 className="fw-semibold mb-3">Categories</h6>
              <ul className="list-unstyled small">
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Politics</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Sports</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Entertainment</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Business</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-semibold mb-3">Quick Links</h6>
              <ul className="list-unstyled small">
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">About Us</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Contact</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Advertise</a></li>
                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-semibold mb-3">Follow Us</h6>
              <div className="d-flex gap-3">
                <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '40px', height: '40px' }}>𝕏</a>
                <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '40px', height: '40px' }}>f</a>
                <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '40px', height: '40px' }}>📸</a>
              </div>
            </div>
          </div>
          <div className="border-top border-secondary pt-4 text-center small">
            <p className="mb-0">&copy; 2026 AMEBONAIJA. All rights reserved. | Made with ❤️ in Nigeria</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

// Reusable styles
const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#333',
  marginBottom: '6px'
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 14px',
  fontSize: '14px',
  color: '#333',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  outline: 'none',
  boxSizing: 'border-box'
}

export default WriteStory