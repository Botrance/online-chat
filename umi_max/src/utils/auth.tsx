import { connect, Outlet } from '@umijs/max';
import React from 'react';
@connect((state: any) => state)
class authView extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }
  componentWillMount(): void {
    if (!this.props.authModel.auth) {
      console.log('no');
      history.back();
    }
  }

  render(): React.ReactNode {
    return <Outlet />;
  }
}

export default authView;
