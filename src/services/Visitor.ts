import AsyncStorage from '@react-native-async-storage/async-storage';

export const VISITOR_IDENT_KEY = 'fullstory-guides-and-surveys-visitor-ident';

class Visitor {
  private cachedIdent: string | null = null;

  /**
   * Gets or creates a visitor identifier.
   * Checks AsyncStorage first, generates a new UUID if not found.
   * Caches the result in memory for performance.
   */
  async getIdent(): Promise<string> {
    if (this.cachedIdent) {
      return this.cachedIdent;
    }

    try {
      const storedIdent = await AsyncStorage.getItem(VISITOR_IDENT_KEY);

      if (storedIdent) {
        this.cachedIdent = storedIdent;
        return storedIdent;
      }

      const newIdent = this.generateUUID();

      try {
        await AsyncStorage.setItem(VISITOR_IDENT_KEY, newIdent);
      } catch (writeError) {
        console.warn(
          'Failed to save visitor identifier to AsyncStorage:',
          writeError
        );
        // Continue anyway - will regenerate on next launch
      }

      this.cachedIdent = newIdent;
      return newIdent;
    } catch (error) {
      console.warn(
        'Failed to read visitor identifier from AsyncStorage:',
        error
      );
      // Generate new UUID on error
      const newIdent = this.generateUUID();
      this.cachedIdent = newIdent;
      return newIdent;
    }
  }

  private generateUUID(): string {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && performance.now() * 1000) || 0; // Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16; // random number between 0 and 16
      if (d > 0) {
        // Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        // Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}

export const visitor = new Visitor();
