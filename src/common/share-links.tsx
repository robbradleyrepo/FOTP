import { ParsedUrlQueryInput, stringify } from "querystring";
import React, {
  forwardRef,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useState,
} from "react";

import { SOCIAL } from "../config";
import Box from "../ui/base/box";

interface OpenWindowProps {
  height: number;
  name: string;
  url: string;
  width: number;
}

const openWindow = ({ height, name, url, width }: OpenWindowProps) => {
  // Center the new window on the current window
  const top = Math.round(
    (window.top.outerHeight - height) / 2 + window.top.screenY
  );
  const left = Math.round(
    (window.top.outerWidth - width) / 2 + window.top.screenX
  );

  window.open(
    url,
    name,
    `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`
  );
};

type RefTypes = HTMLAnchorElement;
type OptionalProps = "height" | "width";
type ShareLinkProps = Omit<OpenWindowProps, OptionalProps> &
  Partial<Pick<OpenWindowProps, OptionalProps>>;

const ShareLink = forwardRef<RefTypes, ShareLinkProps>(
  ({ height, name, url, width, ...rest }, ref) => {
    let handleClick: MouseEventHandler | undefined;

    if (height && width) {
      handleClick = (ev) => {
        ev.preventDefault();

        openWindow({ height, name, url, width });
      };
    }

    return (
      <Box
        {...rest}
        as="a"
        href={url}
        onClick={handleClick}
        ref={ref}
        rel="noopener noreferrer"
        target="_blank"
      />
    );
  }
);

ShareLink.displayName = "ShareLink";

interface BaseShareLinkProps {
  children?: ReactNode;
}

interface EmailShareLinkProps extends BaseShareLinkProps {
  body: string;
  subject: string;
}

const EmailShareLink = forwardRef<RefTypes, EmailShareLinkProps>(
  ({ body, subject, ...rest }, ref) => {
    const qs = stringify({
      body,
      subject,
    });

    return (
      <ShareLink
        {...rest}
        height={480}
        name="fotpEmailShare"
        ref={ref}
        url={`mailto:?${qs}`}
        width={640}
      />
    );
  }
);

EmailShareLink.displayName = "EmailShareLink";

interface FacebookShareLinkProps extends BaseShareLinkProps {
  hashtag?: string;
  url: string;
}

const FacebookShareLink = forwardRef<RefTypes, FacebookShareLinkProps>(
  ({ hashtag, url, ...rest }, ref) => {
    const qs = stringify({
      app_id: SOCIAL.facebook.appId, // eslint-disable-line @typescript-eslint/naming-convention
      display: "popup",
      href: url,
      ...(hashtag && { hashtag }),
    });

    return (
      <ShareLink
        {...rest}
        height={480}
        name="fotpFacebookShare"
        ref={ref}
        url={`https://www.facebook.com/dialog/share?${qs}`}
        width={640}
      />
    );
  }
);

FacebookShareLink.displayName = "FacebookShareLink";

interface MessengerShareLinkProps extends BaseShareLinkProps {
  url: string;
}

const MessengerShareLink = forwardRef<RefTypes, MessengerShareLinkProps>(
  ({ url, ...rest }, ref) => {
    // This is a pretty hacky work-around, but it results in a much better UX
    // on mobile, and seems to be used by other common sharing tools
    const [isMobile, setIsMobile] = useState(false); // Default to `false` for consistent server/client rendering

    const baseUrl = isMobile
      ? "fb-messenger://share/"
      : "https://www.facebook.com/dialog/send";
    const options: ParsedUrlQueryInput = {
      app_id: SOCIAL.facebook.appId, // eslint-disable-line @typescript-eslint/naming-convention
      link: url,
    };

    if (!isMobile) {
      options.redirect_uri = process.env.ORIGIN; // eslint-disable-line @typescript-eslint/naming-convention
    }

    const qs = stringify(options);

    useEffect(() => {
      setIsMobile(
        /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
          /Android/i.test(window.navigator.userAgent)
      );
    }, []);

    return (
      <ShareLink
        {...rest}
        height={640}
        name="fotpMessengerShare"
        ref={ref}
        url={`${baseUrl}?${qs}`}
        width={1000}
      />
    );
  }
);

MessengerShareLink.displayName = "MessengerShareLink";

interface TwitterShareLinkProps extends BaseShareLinkProps {
  hashtags?: string[];
  text?: string;
  url: string;
}

const TwitterShareLink = forwardRef<RefTypes, TwitterShareLinkProps>(
  ({ hashtags = [], text, url, ...rest }, ref) => {
    const qs = stringify({
      hashtags: hashtags.map((hashtag) => hashtag.replace(/^#/, "")).join(","),
      url,
      ...(text && { text }),
    });

    return (
      <ShareLink
        {...rest}
        height={420}
        name="fotpTwitterShare"
        ref={ref}
        url={`https://twitter.com/intent/tweet?${qs}`}
        width={550}
      />
    );
  }
);

TwitterShareLink.displayName = "TwitterShareLink";

interface WhatsAppShareLinkProps extends BaseShareLinkProps {
  text: string;
}

const WhatsAppShareLink = forwardRef<RefTypes, WhatsAppShareLinkProps>(
  ({ text, ...rest }, ref) => {
    const qs = stringify({
      text,
    });

    return (
      <ShareLink
        {...rest}
        name="fotpWhatsAppShare"
        ref={ref}
        url={`https://api.whatsapp.com/send?${qs}`}
      />
    );
  }
);

WhatsAppShareLink.displayName = "WhatsAppShareLink";

export {
  EmailShareLink,
  FacebookShareLink,
  MessengerShareLink,
  TwitterShareLink,
  WhatsAppShareLink,
};
