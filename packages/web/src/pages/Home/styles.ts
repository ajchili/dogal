import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
    container: {
        padding: 25,
        border: "2px solid grey"
    },
    inputSection: {
        display: "flex",
        "& > *": {
            flex: 1,
        }
    }
})