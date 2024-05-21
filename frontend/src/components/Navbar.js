import { Link } from 'react-router-dom'

import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
	const { logout } = useLogout()
	const { user } = useAuthContext()

	const handleClick = () =>{
		logout()
	}
    const displayProfilePic = ()=>{
        const profilePicPortal = document.querySelector('.profile-pic-popup');
        profilePicPortal.showModal();
        document.body.style.overflow = 'hidden';
        
        profilePicPortal.addEventListener('click', (e)=>{
            console.log(e.target);
            if (e.target === profilePicPortal) {
                profilePicPortal.close();
                document.body.style.overflow = '';
            }
        })
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
								<img className="profile-pic" src="concentric-circles.jpg" alt="" />
							</div>
							<button onClick={handleClick}>Log Out</button>

                            <dialog className="profile-pic-popup" >
                                <div>
                                    <img src="concentric-circles.jpg" alt="" />
                                    <div className='options'>
                                        <button>remove</button>
                                        <button>update</button>
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