import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import api from './api';

import { PrimaryBtn } from './App';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.2);
`;

const MainContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  padding: 12px 20px;
  background: #fff;
  border-radius: 6px;
`;

const ModalHeader = styled.div`
  display: flex;
  height: 56px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;

  > h4 {
    margin-block-start: 0;
    margin-block-end: 0;
  }

  > span {
    cursor: pointer;
  }
`;

const Input = styled.input`
  display: block;
  height: 36px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  padding: 0 12px;
  outline: 0;
  font-size: 13px;
  margin: 5px 0;
  width: calc(100% - 26px);

  &:focus {
    border-color: #000;
  }
`;

const TextArea = styled(Input)`
  height: unset;
  padding: 12px;
`;

const ArticleFormModal = ({ data, article, setData, hideModal }) => {
  const [title, setTitle] = useState(article ? article.title : '');
  const [body, setBody] = useState(article ? article.body : '');
  const [submitting, setSubmitting] = useState(false);

  const isForUpdate = !!article;
  const onSubmit = () => {
    setSubmitting(true);
    if (isForUpdate) {
      const { ind, ...restOfArticle } = article;
      const params = { ...restOfArticle, title, body };
      api(`/${article.id}`, 'PUT', params)
      .then((res) => {
        const copyOfData = [...data];
        copyOfData[ind] = res;
        setData(copyOfData);
        alert('Article updated successfully');
        hideModal();
      })
      .catch((e) => {
        alert(e);
      });
    } else {
      const params = { userId: 1, title, body };
      api('', 'POST', params)
      .then((res) => {
        setData([...data, { id: res.id, ...params }]);
        alert('Article added successfully');
        hideModal();
      })
      .catch((e) => {
        alert(e);
      });
    }
    setSubmitting(false);
  };

  return (
    <>
      <Overlay />
      <MainContainer>
        <ModalHeader>
          <h4>{isForUpdate ? 'Update' : 'Create'} Article</h4>
          <span onClick={() => hideModal()}>x</span>
        </ModalHeader>
        <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <TextArea
          as="textarea"
          rows="5"
          placeholder="Body"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <PrimaryBtn disabled={submitting} onClick={onSubmit}>
          {submitting ? 'Submitting...' : 'Submit'}
        </PrimaryBtn>
      </MainContainer>
    </>
  );
};

const articleShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  ind: PropTypes.number,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
});

ArticleFormModal.propTypes = {
  article: articleShape,
  setData: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(articleShape),
};

ArticleFormModal.defaultProps = {
  article: null,
  data: [],
};

export default ArticleFormModal;
