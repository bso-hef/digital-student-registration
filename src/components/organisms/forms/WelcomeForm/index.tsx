import CustomTitle from "@/components/atoms/CustomTitle";
import { Box, Typography, styled } from "@mui/material";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "space-between",
  textAlign: "center",
  width: "100%",
  height: "100%",
  color: theme.palette.text.default,
}));

const Information = styled(Typography)(({ theme }) => ({
  fontSize: "18px !important",
  fontWeight: 400,
  lineHeight: "24px !important",
  letterSpacing: "0.115px",
  color: theme.palette.text.default,
  marginBottom: theme.spacing(1),
}));

const WelcomeForm = () => {
  return (
    <Wrapper>
      <CustomTitle
        title="Anmeldung der BSO"
        subTitle="Schließen Sie in 10 Schritten ihre Anmeldung ab."
      >
        <Information>
          In den nachfolgenden Schritten wirst du nach und nach durch deine
          Schulanmeldung geführt.
        </Information>

        <Information>
          Dort werden dir deine eigenen Daten angezeigt und du kannst veraltete
          oder falsche Daten einfach abändern.
        </Information>

        <Information>
          Solltest du bemerken, dass du etwas versehentlich abgeändert hast,
          kannst du einfach zurück gehen und diese erneut abändern.
        </Information>

        <Information>
          Solltest du dennoch Hilfe brauchen, spreche einfach deinen Lehrer
          darauf an.
        </Information>
      </CustomTitle>
    </Wrapper>
  );
};

export default WelcomeForm;
