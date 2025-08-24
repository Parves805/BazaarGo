
'use client';

import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, query, Query, DocumentData } from 'firebase/firestore';
import { isFirebaseConfigured } from '@/lib/firebase';

interface QueryResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
}

export function useFirestoreQuery<T>(
  firestoreQuery: Query<DocumentData> | null,
  dependencies: any[] = []
): QueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the query to prevent re-creating it on every render
  const memoizedQuery = useMemo(() => firestoreQuery, dependencies);

  useEffect(() => {
    if (!isFirebaseConfigured || !memoizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (querySnapshot) => {
        const results: T[] = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(results);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore query error:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [memoizedQuery]); // Effect runs when the memoized query changes

  return { data, isLoading, error };
}
