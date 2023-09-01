import { DBConfig } from 'ngx-indexed-db';


export const dbConfig: DBConfig = {
	name: 'tqa_db',
	version: 1,

	objectStoresMeta: [
		{
			store: 'record',

			storeConfig: {
				keyPath: ['user', 'serialNumber'],
				autoIncrement: false
			},

			storeSchema: [
				{
					name: 'user',
					keypath: 'user',
					options: {
						unique: false
					}
				},
				{
					name: 'serialNumber',
					keypath: 'serialNumber',
					options: {
						unique: false
					}
				},
				{
					name: 'recordDto',
					keypath: 'recordDto',
					options: {
						unique: false
					}
				}
			]
		},

		{
			store: 'queueHold',

			storeConfig: {
				keyPath: 'user',
				autoIncrement: false
			},

			storeSchema: [
				{
					name: 'user',
					keypath: 'user',
					options: {
						unique: false
					}
				},
				{
					name: 'onHoldRecords',
					keypath: 'onHoldRecords',
					options: {
						unique: false
					}
				}
			]
		},
        {
            store: 'queueDiff',

            storeConfig: {
                keyPath: 'user',
                autoIncrement: false
            },

            storeSchema: [
                {
                    name: 'user',
                    keypath: 'user',
                    options: {
                        unique: false
                    }
                },
                {
                	name: 'diffRecords',
                	keypath: 'diffRecords',
                	options: {
                		unique: false
                	}
                }
            ]
        }
	]
};
