import { useUser } from "@/hooks/user/useUser";
import styles from "./Subscription.module.css";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { invoice, init } from "@telegram-apps/sdk";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { ADVANTAGES } from "@/app/constants";
import { fetchUtil } from "@/api/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { userState } from "@/store/slices/userSlice/userSelectors";
import { getPremiumEndsDate } from "@/utils/getPremiumEndsDate";
import { setPremiumWindow } from "@/store/slices/userSlice/userSlice";

const Subscription: React.FC = () => {
  const { data: user } = useUser();
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { isPremuim } = useSelector(userState);
  const dispatch = useDispatch();

  const handleLink = async (amount: number) => {
    init();
    try {
      if (!invoice.isSupported()) {
        alert(
          "Invoices are not supported on this client. Try Telegram on iOS or Android."
        );
        return;
      }

      const response = await fetchUtil("api/createInvoiceLink", {
        method: "POST",
        body: JSON.stringify({ amount: amount }),
      });

      const { success, invoiceLink } = response;
      if (!success || !invoiceLink) {
        alert("Failed to fetch invoice link.");
        return;
      }

      const promise = invoice.open(invoiceLink, "url");
      const status = await promise;
      if (status === "paid") {
        location.reload();
      }
    } catch {
      alert("Failed to open invoice.");
    }
  };

  useEffect(() => {
    const modalRoot = document.getElementById("modal-root");
    setContainer(modalRoot as HTMLElement);
  }, []);

  if (!container) {
    return null;
  }

  if (isPremuim) {
    return createPortal(
      <div
        className={styles.wrapper}
        onClick={() => dispatch(setPremiumWindow(false))}
      >
        <div className={styles.window} onClick={(e) => e.stopPropagation()}>
          <h1 className={styles.heading}>
            Finstor<span>y</span> Premium
          </h1>
          <p>Ваша подписка действует до: </p>
          <p>{getPremiumEndsDate(+user?.premiumUntil!)}</p>
          <button
            className={styles.button}
            onClick={() => {
              dispatch(setPremiumWindow(false));
            }}
          >
            Готово
          </button>
        </div>
      </div>,
      container
    );
  }

  return createPortal(
    <div className={styles.wrapper}>
      <div className={styles.window}>
        <h1 className={styles.heading}>
          Finstor<span>y</span> Premium
        </h1>
        <div className={styles.slider}>
          <Swiper
            modules={[Pagination, A11y, Autoplay]}
            spaceBetween={300}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            loop={true}
            slidesPerView={1}
          >
            {ADVANTAGES.map((advantage) => {
              return (
                <SwiperSlide className={styles.slide} key={advantage.title}>
                  <Image
                    alt="picture"
                    src={`/${advantage.photo}`}
                    width={280}
                    height={280}
                    quality={100}
                  />
                  <h2>{advantage.title}</h2>
                  <p>{advantage.text}</p>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className={styles.buttons}>
          <button onClick={() => handleLink(100)}>
            <p>1 месяц</p>
            <p>
              100{" "}
              <Image
                alt="star"
                src={"/stars/star100.png"}
                width={24}
                height={24}
              />
            </p>
          </button>
          <button onClick={() => handleLink(1000)}>
            <p>
              1 год <span>(-16%)</span>
            </p>
            <p>
              1000{" "}
              <Image
                alt="star"
                src={"/stars/star1000.png"}
                width={24}
                height={24}
              />
            </p>
          </button>
        </div>
      </div>
    </div>,
    container
  );
};

export default Subscription;
