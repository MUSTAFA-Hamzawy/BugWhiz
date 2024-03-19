from tqdm import tqdm
import numpy as np

data = """bug report unknownhostexception is not caught when the host name is invalid in the repositories view newcvs repository location put a garbage host name eg eh complete the wizard expand the project version uhe is thrown log wed jun edt orgeclipsevcmcore cannot locate host eh javanetunknownhostexception eh at javanetinetaddressgetallbyname0inetaddressjava585 at javanetinetaddressgetallbyname0inetaddressjava554 at javanetinetaddressgetbynameinetaddressjava463 at javanetsocketinitsocketjava112 at orgeclipsevcminternalcoreccvsclientpserverconnectioncreatesocket pserverconnectionjava140 at orgeclipsevcminternalcoreccvsclientpserverconnectionopen pserverconnectionjava190 at orgeclipsevcminternalcoreccvsclientconnectionopen connectionjava224 at orgeclipsevcminternalcoreccvsclientclientinit clientjava226 at orgeclipsevcminternalcoreccvscvsadapterinternalfetchmembernames cvsadapterjava768 at orgeclipsevcminternalcoreccvscvsadapterfetchteamstreamprojectnames cvsadapterjava591 at orgeclipsevcminternalcoreteamstreamfetchprojects teamstreamjava58 at orgeclipsevcminternaluimodelteamstreamelementinternalgetchildren teamstreamelementjava82 at orgeclipsevcminternaluimodelteamstreamelement1run teamstreamelementjava39 at orgeclipseswtcustombusyindicatorshowwhilebusyindicatorjava97 at orgeclipsevcminternaluimodelteamstreamelementgetchildren teamstreamelementjava37 at orgeclipseuimodelworkbenchcontentprovidergetchildren workbenchcontentproviderjava53 at orgeclipsejfaceviewersabstracttreeviewergetrawchildren abstracttreeviewerjava568 at orgeclipsejfaceviewersstructuredviewergetfilteredchildren structuredviewerjava281 at orgeclipsejfaceviewersstructuredviewergetsortedchildren structuredviewerjava378 at orgeclipsejfaceviewersabstracttreeviewercreatechildren abstracttreeviewerjava238 at orgeclipsejfaceviewersabstracttreeviewerhandletreeexpand abstracttreeviewerjava611 at orgeclipsejfaceviewersabstracttreeviewer2treeexpanded abstracttreeviewerjava631 at orgeclipseswtwidgetstypedlistenerhandleeventtypedlistenerjava compiled code at orgeclipseswtwidgetswidgetsendeventwidgetjavacompiled code at orgeclipseswtwidgetswidgetsendeventwidgetjavacompiled code at orgeclipseswtwidgetstreewmnotifychildtreejavacompiled code at orgeclipseswtwidgetscompositewmnotifycompositejavacompiled code at orgeclipseswtwidgetscompositewmnotifycompositejavacompiled code at orgeclipseswtwidgetscontrolwindowproccontroljavacompiled code at orgeclipseswtwidgetsdisplaywindowprocdisplayjavacompiled code at orgeclipseswtinternalwin32oscallwindowprocnative method at orgeclipseswtwidgetstreecallwindowproctreejavacompiled code at orgeclipseswtwidgetstreewmlbuttondowntreejava1043 at orgeclipseswtwidgetscontrolwindowproccontroljavacompiled code at orgeclipseswtwidgetsdisplaywindowprocdisplayjavacompiled code at orgeclipseswtinternalwin32osdispatchmessagenative method at orgeclipseswtwidgetsdisplayreadanddispatchdisplayjava compiled code at orgeclipseuiinternalworkbenchruneventloopworkbenchjava compiled code at orgeclipseuiinternalworkbenchrunworkbenchjava620 at orgeclipsecoreinternalbootinternalbootloaderrun internalbootloaderjava815 at orgeclipsecorebootbootloaderrunbootloaderjava285 at javalangreflectmethodinvokenative method at orgeclipsecorelaunchermainbasicrunmainjava69 at orgeclipsecorelaunchermainrunmainjava311 at orgeclipsecorelaunchermainmainmainjava198 notes km pm recommend we catch at level of teamstreamelementinternalgetchildren and do errordialogopenerror recommend that class because its only ui place we can catch and its already catching coreexceptions there anyway there are other places you could get this error since we lazy verify connections but this is the most common also noticed that in vcmmodelelementhandle where this is being caught we should not be loging info messages only errors kh pm yes 
""".lower()

data_test = """bug report after having synchronized and released successfully with teamstream on zrhcvs i attempted to version the project orgeclipsejdtcore and got a dialog saying cvs communication error following stack trace was in the log log sat jun cest orgeclipsevcmcore cvs communication error javaiointerruptedioexception read timed out at javanetsocketinputstreamsocketreadnative method at javanetsocketinputstreamreadsocketinputstreamjavacompiled code at javaiobufferedinputstreamfillbufferedinputstreamjavacompiled code at javaiobufferedinputstreamreadbufferedinputstreamjavacompiled code at orgeclipsevcminternalcoreccvsclientconnectionreadlineoruntilconnectionjavacompiled code at orgeclipsevcminternalcoreccvsclientconnectionreadtokenconnectionjavacompiled code at orgeclipsevcminternalcoreccvsclientclientprocessresponsesclientjavacompiled code at orgeclipsevcminternalcoreccvsclientclientprocessresponsesclientjava397 at orgeclipsevcminternalcoreccvsclientclientexecuteclientjava257 at orgeclipsevcminternalcoreccvscvsadaptercreateprojectversioncvsadapterjava313 at orgeclipsevcminternalcoresharingmanagercreateprojectversionsharingmanagerjava71 at orgeclipsevcminternaluiactionsversionactionversionlocaloperationversionversionactionjava121 at orgeclipsevcminternaluiversionresourcesoperationrunversionresourcesoperationjava45 at orgeclipsejfaceoperationmodalcontextmodalcontextthreadrunmodalcontextjava98 notes pm am my network connection did not drop i am connected over vpn from home to ott next versioning attempt worked fine
 """.lower()

chars = set(data)

data_size, char_size = len(data), len(chars)

print(f'Data size: {data_size}, Char Size: {char_size}')

char_to_idx = {c:i for i, c in enumerate(chars)}
idx_to_char = {i:c for i, c in enumerate(chars)}

train_X, train_y = data[:-1], data[1:]
test_X, test_y = data_test[:-1], data_test[1:]

def oneHotEncode(text):
    output = np.zeros((char_size, 1))
    output[char_to_idx[text]] = 1

    return output

# Xavier Normalized Initialization
def initWeights(input_size, output_size):
    return np.random.uniform(-1, 1, (output_size, input_size)) * np.sqrt(6 / (input_size + output_size))

def sigmoid(input, derivative = False):
    if derivative:
        return input * (1 - input)
    
    return 1 / (1 + np.exp(-input))

def tanh(input, derivative = False):
    if derivative:
        return 1 - input ** 2
    
    return np.tanh(input)

def softmax(input):
    return np.exp(input) / np.sum(np.exp(input))

class LSTM:
    def __init__(self, input_size, hidden_size, output_size, num_epochs, learning_rate):
        # Hyperparameters
        self.learning_rate = learning_rate
        self.hidden_size = hidden_size
        self.num_epochs = num_epochs

        # Forget Gate
        self.wf = initWeights(input_size, hidden_size)
        self.bf = np.zeros((hidden_size, 1))

        # Input Gate
        self.wi = initWeights(input_size, hidden_size)
        self.bi = np.zeros((hidden_size, 1))

        # Candidate Gate
        self.wc = initWeights(input_size, hidden_size)
        self.bc = np.zeros((hidden_size, 1))

        # Output Gate
        self.wo = initWeights(input_size, hidden_size)
        self.bo = np.zeros((hidden_size, 1))

        # Final Gate
        self.wy = initWeights(hidden_size, output_size)
        self.by = np.zeros((output_size, 1))
    
    def reset(self):
        self.concat_inputs = {}

        self.hidden_states = {-1:np.zeros((self.hidden_size, 1))}
        self.cell_states = {-1:np.zeros((self.hidden_size, 1))}

        self.activation_outputs = {}
        self.candidate_gates = {}
        self.output_gates = {}
        self.forget_gates = {}
        self.input_gates = {}
        self.outputs = {}
    
    def forward(self, inputs):
        self.reset()

        outputs = []
        for q in range(len(inputs)):
            self.concat_inputs[q] = np.concatenate((self.hidden_states[q - 1], inputs[q]))

            self.forget_gates[q] = sigmoid(np.dot(self.wf, self.concat_inputs[q]) + self.bf)
            self.input_gates[q] = sigmoid(np.dot(self.wi, self.concat_inputs[q]) + self.bi)
            self.candidate_gates[q] = tanh(np.dot(self.wc, self.concat_inputs[q]) + self.bc)
            self.output_gates[q] = sigmoid(np.dot(self.wo, self.concat_inputs[q]) + self.bo)

            self.cell_states[q] = self.forget_gates[q] * self.cell_states[q - 1] + self.input_gates[q] * self.candidate_gates[q]
            self.hidden_states[q] = self.output_gates[q] * tanh(self.cell_states[q])

            outputs += [np.dot(self.wy, self.hidden_states[q]) + self.by]

        return outputs
    
    def backward(self, errors, inputs):
        d_wf, d_bf = 0, 0
        d_wi, d_bi = 0, 0
        d_wc, d_bc = 0, 0
        d_wo, d_bo = 0, 0
        d_wy, d_by = 0, 0

        dh_next, dc_next = np.zeros_like(self.hidden_states[0]), np.zeros_like(self.cell_states[0])
        for q in reversed(range(len(inputs))):
            error = errors[q]

            # Final Gate Weights and Biases Errors
            d_wy += np.dot(error, self.hidden_states[q].T)
            d_by += error

            # Hidden State Error
            d_hs = np.dot(self.wy.T, error) + dh_next

            # Output Gate Weights and Biases Errors
            d_o = tanh(self.cell_states[q]) * d_hs * sigmoid(self.output_gates[q], derivative = True)
            d_wo += np.dot(d_o, inputs[q].T)
            d_bo += d_o

            # Cell State Error
            d_cs = tanh(tanh(self.cell_states[q]), derivative = True) * self.output_gates[q] * d_hs + dc_next

            # Forget Gate Weights and Biases Errors
            d_f = d_cs * self.cell_states[q - 1] * sigmoid(self.forget_gates[q], derivative = True)
            d_wf += np.dot(d_f, inputs[q].T)
            d_bf += d_f

            # Input Gate Weights and Biases Errors
            d_i = d_cs * self.candidate_gates[q] * sigmoid(self.input_gates[q], derivative = True)
            d_wi += np.dot(d_i, inputs[q].T)
            d_bi += d_i
            
            # Candidate Gate Weights and Biases Errors
            d_c = d_cs * self.input_gates[q] * tanh(self.candidate_gates[q], derivative = True)
            d_wc += np.dot(d_c, inputs[q].T)
            d_bc += d_c

            # Concatenated Input Error (Sum of Error at Each Gate!)
            d_z = np.dot(self.wf.T, d_f) + np.dot(self.wi.T, d_i) + np.dot(self.wc.T, d_c) + np.dot(self.wo.T, d_o)

            # Error of Hidden State and Cell State at Next Time Step
            dh_next = d_z[:self.hidden_size, :]
            dc_next = self.forget_gates[q] * d_cs

        for d_ in (d_wf, d_bf, d_wi, d_bi, d_wc, d_bc, d_wo, d_bo, d_wy, d_by):
            np.clip(d_, -1, 1, out = d_)

        self.wf += d_wf * self.learning_rate
        self.bf += d_bf * self.learning_rate

        self.wi += d_wi * self.learning_rate
        self.bi += d_bi * self.learning_rate

        self.wc += d_wc * self.learning_rate
        self.bc += d_bc * self.learning_rate

        self.wo += d_wo * self.learning_rate
        self.bo += d_bo * self.learning_rate

        self.wy += d_wy * self.learning_rate
        self.by += d_by * self.learning_rate
    
    def train(self, inputs, labels):
        inputs = [oneHotEncode(input) for input in inputs]

        for _ in tqdm(range(self.num_epochs)):
            predictions = self.forward(inputs)

            errors = []
            for q in range(len(predictions)):
                errors += [-softmax(predictions[q])]
                errors[-1][char_to_idx[labels[q]]] += 1

            self.backward(errors, self.concat_inputs)
    
    # Test
    def test(self, inputs, labels):
        accuracy = 0
        probabilities = self.forward([oneHotEncode(input) for input in inputs])

        output = ''
        for q in range(len(labels)):
            prediction = idx_to_char[np.random.choice([*range(char_size)], p = softmax(probabilities[q].reshape(-1)))]

            output += prediction

            if prediction == labels[q]:
                accuracy += 1

        print(f'Ground Truth:\nt{labels}\n')
        print(f'Predictions:\nt{"".join(output)}\n')
        
        print(f'Accuracy: {round(accuracy * 100 / len(inputs), 2)}%')
    
hidden_size = 25

lstm = LSTM(input_size = char_size + hidden_size, hidden_size = hidden_size, output_size = char_size, num_epochs = 1_000, learning_rate = 0.01)

##### Training #####
lstm.train(train_X, train_y)

##### Testing #####
lstm.test(test_X, test_y)