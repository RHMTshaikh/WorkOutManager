import {useEffect, useRef, useState} from 'react'
import { Link } from 'react-router-dom'

import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
	const { logout } = useLogout()
	const { user } = useAuthContext()
	const imageInputRef = useRef(null)
	const [profilePic, setProfilePic] = useState(null)
	var profilePicPopup = document.querySelector('.profile-pic-popup')

	const handleClick = () =>{
		logout()
		setProfilePic(null)
	}
	const closePopup = (e)=>{
		if (e.target === profilePicPopup) {
			profilePicPopup.close()
			document.body.style.overflow = ''
			profilePicPopup.removeEventListener('click', closePopup)
		}
	}
    const displayProfilePic = ()=>{
		profilePicPopup = document.querySelector('.profile-pic-popup')
        profilePicPopup.showModal()
        document.body.style.overflow = 'hidden'
        profilePicPopup.addEventListener('click', closePopup)
    }
	const saveProfirlPic = async (e) =>{
		const file = e.target.files[0]
		const reader = new FileReader()

		let blob = file.slice(0, file.size, "image/jpeg")
		let newFile = new File([blob], `${user.email}-profile-pic.jpeg`, { type: "image/jpeg" })
	
		let formData = new FormData()
		formData.append("imgfile", newFile)
		formData.append('email', user.email)
		
		try {
			const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/profile-pic`, {
				method: 'POST',
                body: formData,
                headers:{
                    'Authorization': `Bearer ${user.token}`
                }
			})
			if (response.ok) {
				reader.onload = (ev) => { // we are attaching a event listner
					setProfilePic(ev.target.result) // Store the image data URL in state
				}
				reader.readAsDataURL(file)
				profilePicPopup.close()
				document.body.style.overflow = ''
			}
		} catch (error) {
			console.error(error)
		}		
	}
	const removeProfilePic = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/profile-pic`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${user.token}`
				}
			});
			if (response.ok) {
				setProfilePic(null);
			} else {
				console.error('Failed to delete profile picture.');
			}
		} catch (error) {
			console.error(error);
		}
		setProfilePic(null)
		profilePicPopup.close();
		document.body.style.overflow = '';
	};
	const fetchProfilePic = async () => {
		if (user) {
			try {
				const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/profile-pic`, {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${user.token}`
					}
				});
				if (response.ok) {
					if ( response.headers.get('Content-Type')) {
						const blob = await response.blob();
						const imageObjectURL = URL.createObjectURL(blob);
						setProfilePic(imageObjectURL);
					}
				} else {
					console.error('Failed to fetch profile picture.');
				}
			} catch (error) {
				console.error(error);
			}
		}
	};

	useEffect(() => {
		if (user) {
			fetchProfilePic()
		}
	},[user])
	
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
								{profilePic ? 
									<img className="profile-pic" src={profilePic} alt="" />
									:
									<span className="material-symbols-outlined account-circle">account_circle</span>
								}
								
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
                                    {profilePic ? 
										<img className="profile-pic" src={profilePic} alt="" />
										:
										<i className="material-symbols-outlined person">person</i>
									}
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