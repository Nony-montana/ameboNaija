// amebo-naija/
// ├── public/
// │   └── index.html
// ├── src/
// │   ├── assets/
// │   │   └── logo.png
// │   │
// │   ├── components/          
// │   │   ├── Navbar.jsx           
// │   │   ├── Footer.jsx           
// │   │   ├── PostCard.jsx         
// │   │   ├── CategoryBadge.jsx    
// │   │   └── Spinner.jsx          
// │   │
// │   ├── pages/               
// │   │   ├── Home.jsx             
// │   │   ├── SinglePost.jsx       
// │   │   ├── Category.jsx         
// │   │   ├── Search.jsx           
// │   │   ├── Login.jsx            
// │   │   ├── Register.jsx         
// │   │   └── dashboard/           
// │   │       ├── Dashboard.jsx    
// │   │       ├── CreatePost.jsx   
// │   │       ├── MyPosts.jsx      
// │   │       └── PendingPosts.jsx 
// │   │
// │   ├── context/             
// │   │   └── AuthContext.jsx      
// │   │
// │   ├── api/                 
// │   │   └── axios.js         done    
// │   │
// │   ├── App.jsx
// │   ├── main.jsx
// │   └── index.css
// ├── .env
// └── package.json

```

- **@reduxjs/toolkit** — the modern way to use Redux (simpler, less code)
- **react-redux** — connects Redux to your React components

---

Your updated folder structure with Redux:
```
// src/
// ├── assets/
// │   └── logo.png
// │
// ├── components/          
// │   ├── Navbar.jsx           
// │   ├── Footer.jsx           
// │   ├── PostCard.jsx         
// │   ├── CategoryBadge.jsx    
// │   └── Spinner.jsx          
// │
// ├── pages/               
// │   ├── Home.jsx             
// │   ├── SinglePost.jsx       
// │   ├── Category.jsx         
// │   ├── Search.jsx           
// │   ├── Login.jsx            
// │   ├── Register.jsx         
// │   └── dashboard/           
// │       ├── Dashboard.jsx    
// │       ├── CreatePost.jsx   
// │       ├── MyPosts.jsx      
// │       └── PendingPosts.jsx 
// │
// ├── store/                    
// │   ├── store.js              
// │   └── slices/
// │       ├── authSlice.js      
// │       └── postSlice.js      
// │
// ├── api/                 
// │   └── axios.js             
// │
// ├── App.jsx
// ├── main.jsx
// └── index.css