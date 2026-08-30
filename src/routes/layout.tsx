import { component$, Slot } from '@builder.io/qwik';
import Footer from '~/components/Footer';
import Header from '~/components/Header';

export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col">
      <Header />
      <div class="flex-1 flex flex-col">
        <Slot />
      </div>
      <Footer />
    </div>
  );
});