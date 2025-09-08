import { useEffect } from "react";
import { useSetLoginMutation } from "../../services/apiSlice/userApiSlice";
import { useNavigate } from "react-router-dom";
import { path } from "../../constants";


const LoginPage = () => {
	const navigate = useNavigate();
	const [login] = useSetLoginMutation();

	useEffect(() => {
		login({ userName: "sinul", password: "123456Aa." }).unwrap().then((res) => {
			if ( !res.error ) {
				navigate(path.PATERNS);
				localStorage.setItem("token", res.token);
			}
		});
	}, []);
	return <div>LoginPage</div>;
}

export default LoginPage;
