import os
import numpy as np
from multiprocessing import Pool
from collections import OrderedDict

class Util:

    BUG_PAIR_OUTPUT = 'bug_pairs'
    BUG_IDS_OUTPUT = 'bug_ids'

    @staticmethod
    def paralelize_processing(bugs, callback, parameters):
        
        # get the number of cpu cores and let 1 core for the system
        cpu = os.cpu_count() - 1

        # start N worker processes
        pool = Pool(processes=cpu) 
        works = []

        # divide the bugs between the cores
        n = len(bugs) // cpu
        n = 1 if n == 0 else n
        sliced = []
        pos_end = n
        end = len(bugs)
        
        # assign the bugs for each worker in the sliced list
        for i in range(cpu):
            pos_end = end if pos_end>=end else pos_end
            pos_end = end if (i+1) == cpu and pos_end < end else pos_end
            sliced.append(bugs[i*n:pos_end])
            pos_end += n

        # iterating over the slices and creates a tuple config containing the slice of bugs and other parameters.
        # Then, it appends a tuple (callback, config) to the works list. 
        # The callback function will be applied asynchronously to each slice of bugs.
        print("Slicing in {} workers".format(len(sliced)))
        for s in sliced:
            if len(s) > 0:
                config = list(parameters)
                config.insert(0, s)
                config = tuple(config)
                works.append(pool.apply_async(callback, config))
                #dump_vocabulary(s, bug_dir)

        # The get() method blocks until the result of the corresponding task is available.
        # This means it waits for each task to complete and retrieves its result.
        print("Executing the works...")
        res = [w.get() for w in works]
        return res

    # This function saves a dictionary-like structure into a file in a tab-separated format, 
    # with each line containing a key-value pair.
    @staticmethod
    def save_dict(set, filename):
        with open(filename, 'w') as f:
          for i, item in enumerate(set):
            f.write('%s\t%d\n' % (item, i))

    #This load_dict method load a dictionary-like structure from a file that is formatted with key-value pairs separated by tabs. 
    @staticmethod
    def load_dict(filename):
        dict = {}
        with open(filename, 'r') as f:
            for line in f:
                tokens = line.split('\t')
                dict[tokens[0]] = tokens[1]
        return dict

    # This method to extract pairs of bugs and unique bug identifiers from the input array. 
    # Each tuple in the array contains a bucket identifier and a set of duplicates within that bucket.
    # The method then generates pairs of duplicates within each bucket and collects unique bug identifiers.
    @staticmethod
    def getting_pairs(array):
        res = []
        bug_ids = set()
        for row in array:
            dup_bucket, dups = row
            bug_ids.add(dup_bucket)
            dups = list(dups)
            while len(dups) > 1:
                bucket = dups[0]
                bug_ids.add(bucket)
                dups.remove(bucket)
                for d in dups:
                    bug_ids.add(d)
                    res.append([bucket, d])
        return res, bug_ids   

    # This read_pairs function reads pairs of bugs and their corresponding IDs from a dataframe and then write them to text files
    @staticmethod
    def read_pairs(DIR, buckets, df):
        bug_pairs = []
        bucket_dups = []
        bug_ids = set()
        # buckets
        for key in buckets:
          if len(buckets[key]) > 1:
              bucket_dups.append([key, list(buckets[key])])

        bug_pairs, bug_ids = Util.getting_pairs(bucket_dups)

        with open(os.path.join(DIR, '{}.txt'.format(Util.BUG_PAIR_OUTPUT)), 'w') as f:
          for pair in bug_pairs:
            f.write("{} {}\n".format(pair[0], pair[1]))
        bug_ids = sorted(bug_ids)
        with open(os.path.join(DIR, '{}.txt'.format(Util.BUG_IDS_OUTPUT)), 'w') as f:
          for bug_id in bug_ids:
            f.write("%d\n" % bug_id)
        return bug_pairs, bug_ids

    # This method writes each string in the rank list to the specified file, with each string on a new line.
    @staticmethod
    def save_rank(path, rank):
        with open(path, 'w') as file_out:
            for row in rank:
                file_out.write(row + "\n")

    # This function is useful when you need to iterate over a dictionary in a specific order based on its keys, as OrderedDict preserves the order of insertion.
    @staticmethod
    def sort_dict_by_key(dictionary):
        return OrderedDict(sorted(dictionary.items()))

    # The function converts an index to a one-hot encoded array of a specified size.
    @staticmethod
    def to_one_hot(idx, size):
        one_hot = np.zeros(size)
        one_hot[int(float(idx))] = 1
        return one_hot

    # This method creates a directory if it does not exist.
    @staticmethod
    def create_dir(dirName):
        if not os.path.exists(dirName):
            os.makedirs(dirName)
            print("Directory " , dirName ,  " Created ")
        else:    
            print("Directory " , dirName ,  " already exists") 

    # The function retrieves information from a bug 
    # and encode it into a one-hot vector based on a given dictionary of categories (info_dict).
    @staticmethod
    def get_info(bug, info_dict, DOMAIN):
        if DOMAIN != 'firefox':
            info = np.concatenate((
                Util.to_one_hot(bug['bug_severity'], info_dict['bug_severity']),
                Util.to_one_hot(bug['bug_status'], info_dict['bug_status']),
                Util.to_one_hot(bug['component'], info_dict['component']),
                Util.to_one_hot(bug['priority'], info_dict['priority']),
                Util.to_one_hot(bug['product'], info_dict['product']),
                Util.to_one_hot(bug['version'], info_dict['version']))
            )
        else:
            info = np.concatenate((
                Util.to_one_hot(bug['bug_status'], info_dict['bug_status']),
                Util.to_one_hot(bug['component'], info_dict['component']),
                Util.to_one_hot(bug['priority'], info_dict['priority']),
                Util.to_one_hot(bug['version'], info_dict['version']))
            )
        return info