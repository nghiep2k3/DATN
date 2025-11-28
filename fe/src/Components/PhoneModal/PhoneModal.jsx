import React, { useState } from "react";
import { Modal, Input, Button } from "antd";

export default function PhoneModal({ open, onCancel, onSubmit }) {
    const [phone, setPhone] = useState("");

    return (
        <Modal
            title="Nhập số điện thoại"
            open={open}
            footer={null}
            onCancel={onCancel}
        >
            <p>Vui lòng nhập số điện thoại để tiếp tục:</p>

            <Input
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <Button
                type="primary"
                className="mt-3"
                block
                onClick={() => {
                    if (phone.trim().length < 9) {
                        return alert("Số điện thoại không hợp lệ");
                    }
                    onSubmit(phone);
                }}
            >
                Xác nhận
            </Button>
        </Modal>
    );
}
