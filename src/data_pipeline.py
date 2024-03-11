import pandas as pd

path = 'BugWhiz\\dataset'

def load_data():
    # Load Eclipse datasets
    eclipse_df = pd.read_csv(path +'\\eclipse\\eclipse.csv')

    eclipse_pairs_df = pd.read_csv(path +'\\eclipse\\eclipse_pairs.csv')
    eclipse_small_df = pd.read_csv(path +'\\eclipse\\eclipse_small.csv')
    eclipse_small_pairs_df = pd.read_csv(path +'\\eclipse\\eclipse_small_pairs.csv')

    # Load Eclipse Test dataset
    eclipse_test_df = pd.read_csv(path +'\\eclipse_test\\eclipse_test.csv')

    # Load Firefox datasets
    firefox_df = pd.read_csv(path +'\\firefox\\firefox.csv')
    firefox_pairs_df = pd.read_csv(path +'\\firefox\\firefox_pairs.csv')

    # Load NetBeans datasets
    netbeans_copia_df = pd.read_csv(path +'\\netbeans\\netbeans-Copia.csv')
    netbeans_df = pd.read_csv(path +'\\netbeans\\netbeans.csv')
    netbeans_pairs_copia_df = pd.read_csv(path +'\\netbeans\\netbeans_pairs-Copia.csv')
    netbeans_pairs_df = pd.read_csv(path +'\\netbeans\\netbeans_pairs.csv')

    # Load OpenOffice datasets
    openoffice_df = pd.read_csv(path +'\\openoffice\\openoffice.csv')
    openoffice_pairs_df = pd.read_csv(path +'\\openoffice\\openoffice_pairs.csv')

    return (eclipse_df, eclipse_pairs_df, eclipse_small_df, eclipse_small_pairs_df,
            eclipse_test_df, firefox_df, firefox_pairs_df, netbeans_copia_df,
            netbeans_df, netbeans_pairs_copia_df, netbeans_pairs_df, openoffice_df,
            openoffice_pairs_df)

'''
if __name__ == "__main__":
    # Load data
    (eclipse_df, eclipse_pairs_df, eclipse_small_df, eclipse_small_pairs_df,
    eclipse_test_df, firefox_df, firefox_pairs_df, netbeans_copia_df,
    netbeans_df, netbeans_pairs_copia_df, netbeans_pairs_df, openoffice_df,
    openoffice_pairs_df) = load_data()

    # Print first 10 rows of each DataFrame
    print("Eclipse Dataset:")
    print(eclipse_df.head(10))

    print("\nEclipse Pairs Dataset:")
    print(eclipse_pairs_df.head(10))

    print("\nEclipse Small Dataset:")
    print(eclipse_small_df.head(10))

    print("\nEclipse Small Pairs Dataset:")
    print(eclipse_small_pairs_df.head(10))

    print("\nEclipse Test Dataset:")
    print(eclipse_test_df.head(10))

    print("\nFirefox Dataset:")
    print(firefox_df.head(10))

    print("\nFirefox Pairs Dataset:")
    print(firefox_pairs_df.head(10))

    print("\nNetBeans Copia Dataset:")
    print(netbeans_copia_df.head(10))

    print("\nNetBeans Dataset:")
    print(netbeans_df.head(10))

    print("\nNetBeans Pairs Copia Dataset:")
    print(netbeans_pairs_copia_df.head(10))

    print("\nNetBeans Pairs Dataset:")
    print(netbeans_pairs_df.head(10))

    print("\nOpenOffice Dataset:")
    print(openoffice_df.head(10))

    print("\nOpenOffice Pairs Dataset:")
    print(openoffice_pairs_df.head(10))
'''