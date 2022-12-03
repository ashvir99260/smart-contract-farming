import * as React from "react";

import MUiDialog from "@mui/material/Dialog";
import MUiDialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const DialogTitle = ({ children, onClose, showCloseButton, ...other }) => {
  return (
    <MUiDialogTitle sx={children ? { m: 0, p: 2 } : { m: 0, p: 0 }} {...other}>
      {children}
      {showCloseButton && onClose ? (
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MUiDialogTitle>
  );
};

export default function Dialog({
  children,
  title,
  open,
  onClose,
  actionButtons,
  dialogTitleProps,
  dialogContentProps,
  showCloseButton = true,
  ...props
}) {
  return (
    <div>
      <MUiDialog onClose={onClose} open={open} {...props}>
        <DialogTitle
          onClose={onClose}
          showCloseButton={showCloseButton}
          {...dialogTitleProps}
        >
          {title}
        </DialogTitle>
        <DialogContent {...dialogContentProps}>{children}</DialogContent>
        {actionButtons && <DialogActions>{actionButtons}</DialogActions>}
      </MUiDialog>
    </div>
  );
}
