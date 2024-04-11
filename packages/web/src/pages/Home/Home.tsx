import { useLayoutEffect, useRef, useState } from "react";
import { type ApplicationVerifier, getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { useStyles } from "./styles.js";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store.js";
import { signin, submitConfirmationResult } from "../../state/slices/auth.js";

export const Home = (): JSX.Element => {
    const [applicationVerifier, setApplicationVerifier] = useState<ApplicationVerifier>();
    const applicationVerifierRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const styles = useStyles();

    useLayoutEffect(() => {
        if (!applicationVerifierRef.current) {
            return;
        } else if (applicationVerifier) {
            return;
        }

        const verifier = new RecaptchaVerifier(getAuth(), applicationVerifierRef.current, {});
        verifier.render();
        setApplicationVerifier(verifier);
    }, [applicationVerifierRef]);

    return <div>
        <form className={styles.container} onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            if (!applicationVerifier) {
                return;
            }

            const phoneNumber = formData.get("phoneNumber")!.toString();
            dispatch(signin({ phoneNumber, applicationVerifier }))
                .then(({ payload }) => {
                    const code = prompt("Give me the code");
                    if (code) {
                        dispatch(submitConfirmationResult({ verificationCode: code, verificationId: payload }))
                            .then(() => {
                                console.log("login successful", getAuth().currentUser);
                            });
                    }
                });
        }}>
            <div className={styles.inputSection}>
                <label>Phone Number</label>
                <input name="phoneNumber" type="text" placeholder="+1 (123) 456-7890" />
            </div>
            <div ref={applicationVerifierRef} />
            <button>Login</button>
        </form>
    </div >;
}