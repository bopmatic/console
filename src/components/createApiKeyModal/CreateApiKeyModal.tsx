import { Modal, Typography } from '@mui/material';
import * as React from 'react';
import { TextField, Button, Stack, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { CreateApiKeyRequest } from '../../client';
import getBopmaticClient from '../../client/client';
import CircularProgress from '@mui/material/CircularProgress';
import DoneIcon from '@mui/icons-material/Done';
import BopmaticLink from '../link/BopmaticLink';

type CreateApiKeyModalProps = {
  open: boolean;
  handleClose: () => void;
  refreshKeysCallback: () => void;
};

const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({
  open,
  handleClose,
  refreshKeysCallback,
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(
    dayjs().add(1, 'year')
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [stage, setStage] = useState<'initiate' | 'success'>('initiate');
  const [keyId, setKeyId] = useState<string>('');
  const [keyData, setKeyData] = useState<string>('');
  const [copyClipboardMsg, setCopyClipboardMsg] = useState<string>('');
  const [copyClipboardErrorMsg, setCopyClipboardErrorMsg] =
    useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createKey();
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setExpirationDate(dayjs().add(1, 'year'));
    handleClose();
  };

  const handleExpirationDateChange = (newDate: Dayjs | null) => {
    setExpirationDate(newDate);
  };

  const handleContinue = () => {
    handleCancel(); // reset values and close modal
    setStage('initiate');
  };

  const copyText = () => {
    navigator.clipboard
      .writeText(keyData)
      .then(() => {
        setCopyClipboardMsg('Copied!');
      })
      .catch((err) => {
        setCopyClipboardErrorMsg(
          'Failed to copy, please manually copy the Key data'
        );
      });
  };

  const createKey = () => {
    if (!expirationDate) {
      setErrorMsg('Expiration date is required');
      return;
    }
    const expireTime = Math.floor(expirationDate.valueOf() / 1000).toString();
    const req: CreateApiKeyRequest = {
      expireTime: expireTime,
    };
    if (name && name.length) {
      req.name = name;
    }
    if (description && description.length) {
      req.description = description;
    }
    setIsLoading(true);
    getBopmaticClient()
      .createApiKey(req)
      .then((res) => {
        if (res) {
          setKeyId(res.data.keyId as string);
          setKeyData(res.data.keyData as string);
        }
        // success, now go and refresh keys
        setStage('success');
        refreshKeysCallback();
      })
      .catch((err) => {
        console.log('Error creating API key:', err);
        setErrorMsg(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
        {stage === 'initiate' ? (
          <>
            <div className="flex">
              <Typography variant="h5">Create developer API key</Typography>
            </div>
            <TextField
              label="Token name (optional)"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mt: 4 }}
            />
            <TextField
              label="Description (optional)"
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mt: 4 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Expiration date"
                value={expirationDate}
                onChange={handleExpirationDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
                sx={{ mt: 4 }}
              />
            </LocalizationProvider>
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
                Create Key
              </Button>
            </Stack>
            {errorMsg && <div className="text-boperror">Error: {errorMsg}</div>}
          </>
        ) : (
          <>
            <div>
              <div className="flex justify-center">
                <div className="bg-boporangelight w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-boporange">
                    <DoneIcon />
                  </span>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="text-bopblack font-bold">
                  Developer API Key created successfully
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="text-bopgreytext text-sm text-center">
                  Below is your Key ID and Key Secret (data). You won't be able
                  to recover the secret part of your key at a later time. Please
                  ensure you save this somewhere before pressing continue.
                </div>
              </div>
              <div className="text-sm text-bopgreytext mt-6">
                <div className="font-bold">Key ID:</div>
                <div className="bg-gray-100 border border-gray-300 text-sm text-gray-800 font-mono p-4 rounded overflow-auto">
                  {keyId}
                </div>
              </div>
              <div className="text-sm text-bopgreytext mt-2">
                <div className="font-bold">Key Data:</div>
                <div className="bg-gray-100 border border-gray-300 text-sm text-gray-800 font-mono p-4 rounded overflow-auto">
                  {keyData}
                </div>
                <div className="flex">
                  <span className="text-xs">
                    <BopmaticLink to="#" onClick={copyText}>
                      Copy to clipboard
                    </BopmaticLink>
                  </span>
                  {copyClipboardMsg && (
                    <span className="text-xs text-bopsuccess ml-2">
                      {copyClipboardMsg}
                    </span>
                  )}
                  {copyClipboardErrorMsg && (
                    <span className="text-xs text-boperror ml-2">
                      {copyClipboardErrorMsg}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleContinue}
                  sx={{
                    mt: 4,
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CreateApiKeyModal;
