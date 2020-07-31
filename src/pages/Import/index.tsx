import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    let success = uploadedFiles.length > 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const uploadedFile of uploadedFiles) {
      const data = new FormData();
      data.append('file', uploadedFile.file, uploadedFile.name);

      try {
        // eslint-disable-next-line no-await-in-loop
        await api.post('/transactions/import', data);
      } catch (err) {
        success = false;
        // eslint-disable-next-line no-console
        console.log(err.response.error);
      }
    }

    if (success) history.push('/');
  }

  function submitFile(files: File[]): void {
    const submittedFiles = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(submittedFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
