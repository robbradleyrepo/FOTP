import React, { useState } from "react";

import { belt, gutter, s } from "@/common/ui/utils";

import { primaryButton } from "../button";
import { bodyText } from "../typography";
import Modal, { ModalType } from ".";
export default {
  title: "Components/Modal",
};

export const ModalPopup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  3;

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  return (
    <div css={s(belt)}>
      <Modal
        _css={s({ maxWidth: 640 })}
        labelledBy="modal-label"
        onClose={closeModal}
        open={isModalOpen}
        type={ModalType.POPUP}
      >
        <div css={s(gutter)}>
          <p css={s(bodyText)} id="modal-label">
            Hello world
          </p>
          <button
            css={s(primaryButton(), (t) => ({
              position: "absolute",
              right: t.spacing.sm,
              top: t.spacing.sm,
            }))}
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </Modal>
      <button css={s(primaryButton())} onClick={openModal}>
        Open modal
      </button>
    </div>
  );
};

export const ModalDrawerLeft = () => {
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);

  const closeLeftDrawer = () => setIsLeftDrawerOpen(false);
  const openLeftDrawer = () => setIsLeftDrawerOpen(true);

  return (
    <div css={s(belt)}>
      <Modal
        labelledBy="drawer-left-label"
        onClose={closeLeftDrawer}
        open={isLeftDrawerOpen}
        type={ModalType.DRAWER}
      >
        <p css={s(bodyText)} id="drawer-left-label">
          Hello world
        </p>
        <button
          css={s(primaryButton(), (t) => ({
            position: "absolute",
            right: t.spacing.sm,
            top: t.spacing.sm,
          }))}
          onClick={closeLeftDrawer}
        >
          Close
        </button>
      </Modal>
      <button css={s(primaryButton())} onClick={openLeftDrawer}>
        Open left-hand drawer
      </button>
    </div>
  );
};

export const ModalDrawerRight = () => {
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

  const closeRightDrawer = () => setIsRightDrawerOpen(false);
  const openRightDrawer = () => setIsRightDrawerOpen(true);

  return (
    <div css={s(belt)}>
      <Modal
        alignment="right"
        labelledBy="drawer-right-label"
        onClose={closeRightDrawer}
        open={isRightDrawerOpen}
        type={ModalType.DRAWER}
      >
        <p
          id="drawer-right-label"
          css={s(bodyText, { transform: "rotateY(180deg)" })}
        >
          Hello world
        </p>
        <button
          css={s(primaryButton(), (t) => ({
            left: t.spacing.sm,
            position: "absolute",
            top: t.spacing.sm,
          }))}
          onClick={closeRightDrawer}
        >
          Close
        </button>
      </Modal>
      <button css={s(primaryButton())} onClick={openRightDrawer}>
        Open right-hand drawer
      </button>
    </div>
  );
};
