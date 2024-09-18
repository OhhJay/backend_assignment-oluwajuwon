import { hash, compare} from 'bcrypt';
import * as crypto from 'crypto';


/**
 * This is for the final password hash in the database for the current service.
 * @param password The password to be temporarily hashed
 */
export const hashPassword = async ( password : string ): Promise<string> => {
    const saltRounds : number = 10;
    console.log(`hashing ${password}`)
    const hashValue = await hash(password, saltRounds);
    return hashValue;
}

/**
 * 
 * @param password 
 * @param hash 
 * @returns 
 */
export const matchPasswordHash = async ( password : string, hash : string ) => {
    const match = await compare(password, hash);
    return match;
}
