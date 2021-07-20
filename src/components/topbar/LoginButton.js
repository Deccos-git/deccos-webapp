import { Link } from "react-router-dom";
import { client } from '../../hooks/Client';

const LoginButton = () => {
    return (
        <div className="profile-photo">
            <Link to={`/${client}/Login`}>
                <button>Login</button>
            </Link>
            <Link to={`/${client}/register`}>
                <button>Aanmelden</button>
            </Link>
        </div>
    )
}

export default LoginButton
