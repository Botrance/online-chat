import Guide from '@/components/Guide';
import { PageContainer } from '@ant-design/pro-components';
import { connect } from '@umijs/max';
import { useEffect } from 'react';
import styles from './index.less';

const HomePage: React.FC = () => {

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={''} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
