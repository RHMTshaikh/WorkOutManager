import {useRef, useState} from 'react'
import { Link } from 'react-router-dom'

import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
	const { logout } = useLogout()
	const { user } = useAuthContext()
	const imageInputRef = useRef(null)
	const [selectedImage, setSelectedImage] = useState(null);
	const defaultImage = 'concentric-circles.jpg' 
	const profilePicPopup = document.querySelector('.profile-pic-popup');

	const handleClick = () =>{
		logout()
	}
	const closePopup = (e)=>{
		if (e.target === profilePicPopup) {
			profilePicPopup.close();
			document.body.style.overflow = '';
			profilePicPopup.removeEventListener('click', closePopup)
		}
	}
    const displayProfilePic = ()=>{
        profilePicPopup.showModal();
        document.body.style.overflow = 'hidden';
        profilePicPopup.addEventListener('click', closePopup)
    }
	const saveProfirlPic = (e) =>{
		const file = e.target.files[0]
		const reader = new FileReader();
		reader.onload = (e) => {
			setSelectedImage(e.target.result); // Store the image data URL in state
		};
		reader.readAsDataURL(file);
		profilePicPopup.close();
		document.body.style.overflow = '';
	}
	const removeProfilePic = ()=>{
		setSelectedImage(null)
		profilePicPopup.close();
		document.body.style.overflow = '';
	}

	return (
		<header>
			<div className="container">
				<Link to={ user ?  `/` : '/login'}>
					<h1>Workout Buddy</h1>
				</Link>
				<nav>
					{user && (
						<div>
							<span>{user.email}</span>
							<div className="profile-pic-div"  onClick={displayProfilePic}>
								<span className="material-symbols-outlined edit-icon" >edit</span>
								<img className="profile-pic" src={selectedImage || defaultImage} alt="" />
							</div>
							<button onClick={handleClick}>Log Out</button>

                            <dialog className="profile-pic-popup" >
                                <div>
									<input
									ref={imageInputRef}
									type="file" 
									name='imgfile'
									accept='image/jpeg' 
									id='imgfile' 
									style={{display:'none'}}
									onChange={saveProfirlPic}
									/>
                                    <img src={selectedImage || defaultImage} alt="" />
                                    <div className='options'>
                                        <button onClick={removeProfilePic}>remove</button>
                                        <button onClick={() => imageInputRef.current.click()}>update</button>
                                    </div>
                                </div>
                            </dialog>
						</div>
					)}
					{!user && (
						<div>
							<Link to={`/login`}>Login</Link>
							<Link to={`/signup`}>Signup</Link>
						</div>
					)}
				</nav>
			</div>
		</header>
	)
}

export default Navbar