import { useEffect } from 'react';
import { EventSearchParams } from '../models/event';
import { clearSearch, fetchById, fetchFeatured, fetchSearch } from '../slices/eventsSlice';
import { useAppDispatch, useAppSelector } from '../store';

export function useFeaturedEvents() {
  const dispatch = useAppDispatch();
  const { featured, loading, error } = useAppSelector((s) => s.events);
  useEffect(() => {
    dispatch(fetchFeatured());
  }, [dispatch]);
  return { featured, loading, error };
}

export function useSearchEvents(params?: EventSearchParams) {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.events);
  useEffect(() => {
    return () => {
      dispatch(clearSearch());
    };
  }, [dispatch]);

  const search = (p: EventSearchParams) => {
    dispatch(fetchSearch(p));
  };
  return { items, loading, error, search };
}

export function useEvent(id?: string) {
  const dispatch = useAppDispatch();
  const item = useAppSelector((s) => (id ? s.events.byId[id] : undefined));
  useEffect(() => {
    if (id && !item) dispatch(fetchById(id));
  }, [dispatch, id, item]);
  return item;
}
