import { Modal } from '@mui/material';
import * as React from 'react';
import { Button, Stack, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import getBopmaticClient from '../../client/client';
import { GridRowSelectionModel } from '@mui/x-data-grid';

type DeleteApiKeyModalProps = {
  open: boolean;
  handleClose: () => void;
  refreshKeysCallback: () => void;
  selectedKeysArr: GridRowSelectionModel;
};

const DeleteApiKeyModal: React.FC<DeleteApiKeyModalProps> = ({
  open,
  handleClose,
  refreshKeysCallback,
  selectedKeysArr,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const handleSubmit = () => {
    deleteSelectedKeys();
  };
  const handleCancel = () => {
    handleClose();
  };
  const deleteSelectedKeys = () => {
    setIsLoading(true);
    const apiCalls = [];
    if (selectedKeysArr && selectedKeysArr.length) {
      for (let i = 0; i < selectedKeysArr.length; i++) {
        apiCalls.push(
          getBopmaticClient().deleteApiKey({
            keyId: selectedKeysArr[i] as string,
          })
        );
      }
      Promise.all(apiCalls)
        .then((res) => {
          // success, now go refresh keys
          refreshKeysCallback();
          handleClose();
        })
        .catch((err) => {
          setErrorMsg(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: '5px',
          boxShadow: 24,
          p: 4,
        }}
      >
        <div className="flex justify-center mt-4">
          <div className="text-bopblack font-bold">Confirm key deletion</div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="text-bopgreytext text-sm text-center">
            Are you sure you want to delete the selected API keys? If yes,
            select <b>Delete</b> or select <b>Cancel</b> to return back to the
            table.
          </div>
        </div>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 4 }}
        >
          {isLoading && <CircularProgress />}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            disabled={isLoading}
            sx={{
              mt: 2,
              minHeight: 50,
              borderColor: '#D7DBEC',
              color: '#5A607F',
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            Delete keys
          </Button>
        </Stack>
        {errorMsg && <div className="text-boperror">Error: {errorMsg}</div>}
      </Box>
    </Modal>
  );
};

export default DeleteApiKeyModal;
