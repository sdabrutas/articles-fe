import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import api from './api';
import ArticleFormModal from './ArticleFormModal';

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #eee;

  * {
    box-sizing: border-box;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  background: #fff;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding: 30px 50px;

  > h2 {
    margin-block-start: 0;
    margin-block-end: 0;
  }
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Input = styled.input`
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  height: 40px;
  line-height: 40px;
  width: 250px;
  padding: 0 12px;
  outline: 0;
  font-size: 16px;
  margin-right: 10px;

  &:focus {
    border-color: #000;
  }
`;

const Dropdown = styled(Input)`
  width: 150px;
  background: #fff;
`;

export const PrimaryBtn = styled.button`
  height: 40px;
  line-height: 40px;
  color: #fff;
  background: #f85959;
  border-color: #f85959;
  border-radius: 5px;
  padding: 0 20px;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background: #ea4444;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Card = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  padding: 10px 15px;
  margin: 12px;
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
  padding: 0 15px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
`;

const CardTitle = styled.h4`
  font-size: 16px;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  margin-block-start: 0;
  margin-block-end: 0;
`;

const CardActionBtn = styled.span`
  cursor: pointer;
  font-size: 11px;
  margin-left: 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const App = () => {
  const [data, setData] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(null);
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [query, setQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [isFormModalShown, setFormModalDisplay] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    setFetchStatus('fetching');
    api()
      .then((res) => {
        setData(res);
        setDataToDisplay(res);
        setFetchStatus('success');
      })
      .catch((e) => {
        alert(e);
        setFetchStatus('failed');
      });
  }, []);

  const renderArticles = () => {
    switch (fetchStatus) {
      case 'success':
        return dataToDisplay.map((article, ind) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle title={article.title}>{article.title}</CardTitle>
              <CardActionBtn
                onClick={() => {
                  setSelectedArticle({ ...article, ind });
                  setFormModalDisplay(true);
                }}
              >
                Edit
              </CardActionBtn>
            </CardHeader>
            <p>{article.body}</p>
          </Card>
        ));
      case 'failed':
        return <div>Failed to fetch articles</div>;
      case 'fetching':
        return <div>Loading...</div>
      default:
        return <div />;
    }
  };

  const searchArticles = () => {
    if (!searchCategory || !query) return;
    if (searchCategory === 'userId' || searchCategory === 'id') {
      setDataToDisplay(data.filter(article => article[searchCategory] === Number(query)));
    } else {
      setDataToDisplay(data.filter(({ title }) => title.includes(query)));
    }
  };

  return (
    <MainContainer data-testid="articles-container">
      <Header>
        <h1>All Articles</h1>
        <span>Hello, User!</span>
      </Header>
      <Content>
        <SearchSection>
          <span>
            <Input placeholder="Search" value={query} onChange={e => setQuery(e.target.value)} />
            <Dropdown as="select" value={searchCategory} onChange={e => setSearchCategory(e.target.value)}>
              <option value="">Search by</option>
              <option value="id">ID</option>
              <option value="userId">User ID</option>
              <option value="title">Title</option>
            </Dropdown>
            <PrimaryBtn onClick={() => searchArticles()}>Search</PrimaryBtn>
          </span>
          <PrimaryBtn
            onClick={() => {
              setFormModalDisplay(true);
            }}
          >
            Add
          </PrimaryBtn>
        </SearchSection>
        <CardsWrapper>
          {renderArticles()}
        </CardsWrapper>
      </Content>
      {isFormModalShown && createPortal((
        <ArticleFormModal
          article={selectedArticle}
          setData={setData}
          hideModal={() => {
            setFormModalDisplay(false);
            setSelectedArticle(null);
          }}
          data={data}
        />
      ), document.getElementById('modal-container'))}
    </MainContainer>
  );
}

export default App;
