import { useNavigate } from "react-router-dom";
import { useGetPaternsQuery, useSetCreatePaternMutation } from "../../services/apiSlice/paternApiSlice";
import { path } from "../../constants";

const PaternsPage = () => {
	const navigate = useNavigate();
	const [createPatern] = useSetCreatePaternMutation();
	const { data: paternsData } = useGetPaternsQuery();
	console.log(paternsData);

    return <div>PaternsPage
		<button onClick={() => {
			createPatern().then((res) => {
				if (res.data) {
					navigate(path.SELECT_IMAGE.replace(":paternId", res?.data?.insertId?.toString()));
					console.log(res);
				}
			});
		}}>Create new patern</button>
	</div>;
};

export default PaternsPage;
