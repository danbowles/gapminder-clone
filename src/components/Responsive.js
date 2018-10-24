import React from 'react';
import { Layout } from '../styles/components/common';

const Responsive = (ComposedComponent) => (
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        containerWidth: null,
      };
    }

    componentDidMount() {
      this.fitParentContainer();
      window.addEventListener('resize', this.fitParentContainer);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.fitParentContainer);
    }

    fitParentContainer = () => {
      const { containerWidth } = this.state;
      const currentWidth = this.container.getBoundingClientRect().width;

      if (containerWidth !== currentWidth) {
        this.setState({
          containerWidth: currentWidth,
        });
      }
    };

    render() {
      const { containerWidth } = this.state;

      return (
        <Layout>
          <div ref={(el) => { this.container = el; }}>
            {
              null !== containerWidth
              && <ComposedComponent {...this.props} width={containerWidth} />
            }
          </div>
        </Layout>
      );
    }
  }
);

export default Responsive;

