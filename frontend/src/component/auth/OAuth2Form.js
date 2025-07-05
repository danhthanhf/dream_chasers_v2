import Button from "./Button";
import FaceBookLogo from "../../assets/images/facebook-svgrepo-com.svg";
import GithubLogo from "../../assets/images/github-svgrepo-com.svg";
import GoogleLogo from "../../assets/images/google-color-svgrepo-com.svg";
function OAuth2Form() {
    return (
        <div className="self-stretch flex flex-col items-start justify-start gap-[20px]">
            <Button
                link="http://localhost:8080/oauth2/authorization/google"
                inputFieldPassword="Login with Google"
                heroiconsOutlinedevicePho={GoogleLogo}
            ></Button>
            {/* <Button 
                link="http://localhost:8080/oauth2/authorization/facebook"
                inputFieldPassword="Login with FaceBook"
                heroiconsOutlinedevicePho={FaceBookLogo}
            /> */}
            <Button
                link="http://localhost:8080/oauth2/authorization/github"
                inputFieldPassword="Login with GitHub"
                heroiconsOutlinedevicePho={GithubLogo}
            />
        </div>
    );
}

export default OAuth2Form;
