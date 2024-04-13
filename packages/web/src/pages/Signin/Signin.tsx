import { type ApplicationVerifier, getAuth, RecaptchaVerifier } from "firebase/auth"
import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./styles.js";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store.js";
import { signin, submitConfirmationResult } from "../../state/slices/auth.js";

type onSigninProps = Parameters<typeof signin>[0];
type onSigninFunction = (props: onSigninProps) => Promise<void>;
type onSubmitConfirmationResultsProps = Pick<Parameters<typeof submitConfirmationResult>[0], "verificationCode">;
type onSubmitConfirmationResultsFunction = (props: onSubmitConfirmationResultsProps) => Promise<void>;

const PhoneNumberForm = (props: { onSubmit: onSigninFunction }): JSX.Element => {
    const [applicationVerifier, setApplicationVerifier] = useState<ApplicationVerifier>();
    const applicationVerifierRef = useRef<HTMLDivElement>(null);
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

    return (
        <form className={styles.container} onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            if (!applicationVerifier) {
                return;
            }

            const phoneNumber = formData.get("phoneNumber")!.toString();
            props.onSubmit({ phoneNumber, applicationVerifier });
        }}>
            <div className={styles.inputSection}>
                <label>Phone Number</label>
                <input name="phoneNumber" type="text" placeholder="+1 (123) 456-7890" required />
            </div>
            <div ref={applicationVerifierRef} />
            <button>Login</button>
        </form>
    );
}

const ConfirmationResultForm = (props: { onSubmit: onSubmitConfirmationResultsFunction }): JSX.Element => {
    const styles = useStyles();

    return (
        <form
            className={styles.container}
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                const verificationCode = formData.get("verificationCode")!.toString();
                props.onSubmit({ verificationCode })
            }}
        >
            <div className={styles.inputSection}>
                <label>Verification Code</label>
                <input name="verificationCode" type="number" required />
            </div>
            <button>Verify</button>
        </form>
    )
}

export const Signin = (): JSX.Element => {
    const [verificationId, setVerificationId] = useState<string>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const onPhoneNumberSubmit = async (props: onSigninProps) => {
        try {
            const { payload } = await dispatch(signin(props));
            setVerificationId(payload as string); // TODO: Fix types
        } catch (e) {
            // TODO: Better error handling
            console.error(e);
            alert("An error occurred!");
        }
    }

    const confirmationResultFormSubmit = async (props: onSubmitConfirmationResultsProps) => {
        if (!verificationId) {
            return;
        }

        try {
            await dispatch(submitConfirmationResult({
                verificationCode: props.verificationCode,
                verificationId
            }));
            navigate("/account");
        } catch (e) {
            // TODO: Better error handling
            console.error(e);
            alert("An error occurred!");
        }

    }

    return (
        <div>
            {verificationId === undefined && <PhoneNumberForm onSubmit={onPhoneNumberSubmit} />}
            {verificationId !== undefined && <ConfirmationResultForm onSubmit={confirmationResultFormSubmit} />}
        </div>
    );
}