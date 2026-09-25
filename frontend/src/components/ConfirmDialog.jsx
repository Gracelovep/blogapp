import Modal from './Modal';

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onCancel, onConfirm }) {
  return (
    <Modal title={title} icon="⚠️" onClose={onCancel} width="380px">
      <div className="modal-form">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
