import React from "react";

enum Status {
  Info = "Info",
  Warning = "Warning",
  Error = "Error",
}

interface InfoProps {
  message: string;
}

const InfoNotificationComponent: React.FC<InfoProps> = ({ message }) => (
  <h5 style={{ color: "DarkSlateBlue" }}>{message}</h5>
);

interface WarningProps {
  message: string;
}

const WarningNotificationComponent: React.FC<WarningProps> = ({ message }) => (
  <h5 style={{ color: "Gold" }}>{message}</h5>
);

interface ErrorProps {
  message: string;
}

const ErrorNotificationComponent: React.FC<ErrorProps> = ({ message }) => (
  <h5 style={{ color: "Crimson" }}>{message}</h5>
);

const NOTIFICATION_STATES = (message: string) => ({
  [Status.Info]: <InfoNotificationComponent message={message} />,
  [Status.Warning]: <WarningNotificationComponent message={message} />,
  [Status.Error]: <ErrorNotificationComponent message={message} />,
});

export const PlayGround: React.FC = () => {
  const [status, setStatus] = React.useState<Status>(Status.Info);
  const [message, setMessage] = React.useState<string>("Hey, I'm a message");

  React.useEffect(() => {
    setStatus(Status.Warning);
  }, []);

  function renderNotification() {
    switch (status) {
      case Status.Info:
        return <InfoNotificationComponent message={message} />;
      case Status.Warning:
        return <WarningNotificationComponent message={message} />;
      case Status.Error:
        return <ErrorNotificationComponent message={message} />;
      default:
        return null;
    }
  }

  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
      {NOTIFICATION_STATES(message)[status]}
    </div>
  );
};
