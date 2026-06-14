import { useState } from 'react';
import { BetaNotifyModal } from '@/components/BetaNotifyModal';
import { Navigation } from '@/components/Navigation';
import { PlatformLanding } from '@/sections/PlatformLanding';
import { ProductPage } from '@/sections/ProductPage';
import type { ProductKey } from '@/lib/product-paths';

function App() {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifySource, setNotifySource] = useState('site');
  const path = window.location.pathname.replace(/\/$/, '');
  const productRoutes: Record<string, ProductKey> = {
    '/local': 'local',
    '/self-hosted': 'local',
    '/linglang-local': 'local',
    '/cloud': 'cloud',
    '/linglang-cloud': 'cloud',
    '/edge': 'edge',
    '/linglang-edge': 'edge',
  };
  const productKey = productRoutes[path];

  const openNotifyModal = (source = 'site') => {
    setNotifySource(source);
    setIsNotifyOpen(true);
  };

  return (
    <div className="site-root">
      <Navigation onOpenNotify={openNotifyModal} />
      {productKey ? (
        <ProductPage productKey={productKey} onOpenNotify={openNotifyModal} />
      ) : (
        <PlatformLanding onOpenNotify={openNotifyModal} />
      )}
      <BetaNotifyModal
        isOpen={isNotifyOpen}
        source={notifySource}
        onClose={() => setIsNotifyOpen(false)}
      />
    </div>
  );
}

export default App;
